"""
ChatterMate - Workflow Execution Service
Copyright (C) 2024 ChatterMate

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>
"""

import traceback
import asyncio
from typing import Optional, Dict, Any, List, Tuple
from uuid import UUID
from sqlalchemy.orm import Session
from dataclasses import dataclass
import json
import re
from datetime import datetime, timedelta

from app.models.workflow import Workflow, WorkflowStatus
from app.models.workflow_node import WorkflowNode, NodeType, ExitCondition
from app.models.workflow_connection import WorkflowConnection
from app.models.session_to_agent import SessionToAgent
from app.repositories.workflow import WorkflowRepository
from app.repositories.session_to_agent import SessionToAgentRepository
from app.repositories.chat import ChatRepository
from app.agents.chat_agent import ChatAgent, ChatResponse
from app.core.logger import get_logger

logger = get_logger(__name__)


@dataclass
class WorkflowExecutionResult:
    """Result of workflow execution"""
    success: bool
    message: str
    next_node_id: Optional[UUID] = None
    workflow_state: Optional[Dict[str, Any]] = None
    should_continue: bool = True
    transfer_to_human: bool = False
    transfer_group_id: Optional[str] = None
    transfer_reason: Optional[str] = None
    transfer_description: Optional[str] = None
    end_chat: bool = False
    request_rating: bool = False
    error: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None
    landing_page_data: Optional[Dict[str, Any]] = None
    intermediate_messages: Optional[List[str]] = None  # Collect messages from MESSAGE nodes during execution


class WorkflowExecutionService:
    """Service for executing workflows in chat sessions"""
    
    def __init__(self, db: Session):
        self.db = db
        self.workflow_repo = WorkflowRepository(db)
        self.session_repo = SessionToAgentRepository(db)
    
    async def execute_workflow(
        self,
        session_id: str,
        user_message: Optional[str],
        workflow_id: UUID,
        current_node_id: Optional[UUID] = None,
        workflow_state: Optional[Dict[str, Any]] = None,
        api_key: str = None,
        model_name: str = None,
        model_type: str = None,
        org_id: str = None,
        agent_id: str = None,
        customer_id: str = None,
        is_initial_execution: bool = False,
        source: str = None
    ) -> WorkflowExecutionResult:
        """
        Execute workflow for a chat session
        
        Args:
            session_id: Session ID
            user_message: User's message
            workflow_id: Workflow to execute
            current_node_id: Current node (None to start from beginning)
            workflow_state: Current workflow state
            api_key: API key for AI model
            model_name: AI model name
            model_type: AI model type
            org_id: Organization ID
            agent_id: Agent ID
            customer_id: Customer ID
            
        Returns:
            WorkflowExecutionResult with execution details
        """
        try:
            logger.info(f"Executing workflow {workflow_id} for session {session_id}")
            logger.debug(f"Current node ID: {current_node_id}")
            logger.debug(f"Workflow state: {workflow_state}")
            logger.debug(f"User message: {user_message}")
            logger.debug(f"Is initial execution: {is_initial_execution}")

            # Get workflow with nodes and connections
            workflow = self.workflow_repo.get_workflow_with_nodes_and_connections(workflow_id)
            logger.debug(f"Workflow ID: {workflow.id}, Name: {workflow.name}, Status: {workflow.status}")
            logger.debug(f"Nodes count: {len(workflow.nodes)}")

            if not workflow:
                return WorkflowExecutionResult(
                    success=False,
                    message="Workflow not found",
                    error="Workflow not found"
                )
            
            # Check if workflow is published
            if workflow.status != WorkflowStatus.PUBLISHED:
                return WorkflowExecutionResult(
                    success=False,
                    message="Workflow is not published",
                    error="Workflow is not published"
                )
            
            # Initialize workflow state if not provided - keep it minimal
            if workflow_state is None:
                workflow_state = {}
            
            # Determine starting node
            if current_node_id is None:
                current_node = self._find_start_node(workflow)
                logger.debug(f"Found starting node: {current_node.id}")
                if not current_node:
                    return WorkflowExecutionResult(
                        success=False,
                        message="No start node found in workflow",
                        error="No start node found"
                    )
            else:
                current_node = self._find_node_by_id(workflow, current_node_id)
                logger.debug(f"Current node: {current_node}")
                if not current_node:
                    return WorkflowExecutionResult(
                        success=False,
                        message="Current node not found",
                        error="Current node not found"
                    )
            
            # Automatic execution loop - continue executing nodes until we reach one that requires user interaction
            final_result = None
            intermediate_messages = []  # Collect messages from MESSAGE nodes during execution
            
            while current_node:
                logger.debug(f"Executing node: {current_node.id} ({current_node.node_type})")
                
                # Execute current node
                result = await self._execute_node(
                    current_node,
                    workflow,
                    workflow_state,
                    user_message,
                    api_key,
                    model_name,
                    model_type,
                    org_id,
                    agent_id,
                    customer_id,
                    session_id,
                    source
                )
                
                # Collect messages from MESSAGE nodes during automatic execution
                if current_node.node_type == NodeType.MESSAGE and result.message:
                    intermediate_messages.append(result.message)
                    logger.debug(f"Collected intermediate message from MESSAGE node: {result.message}")
                
                # Also collect messages from LLM nodes that are not the final stopping node
                # This handles the case where LLM node with single execution produces a response
                # but then moves to the next node (like USER_INPUT)
                if (current_node.node_type == NodeType.LLM and result.message and 
                    result.should_continue and result.next_node_id is not None):
                    intermediate_messages.append(result.message)
                    logger.debug(f"Collected intermediate message from LLM node: {result.message}")
                
                final_result = result
                
                # Check if we should continue to next node automatically
                if not result.success:
                    logger.error(f"Node execution failed: {result.error}")
                    break
                
                # Check stopping conditions
                if (result.form_data or 
                    result.landing_page_data or 
                    result.transfer_to_human or
                    result.end_chat or
                    not result.should_continue or
                    result.next_node_id is None or
                    (current_node.node_type == NodeType.USER_INPUT and not result.should_continue)):
                    logger.info(f"Stopping execution at node {current_node.id}: form_data={bool(result.form_data)}, landing_page={bool(result.landing_page_data)}, transfer={result.transfer_to_human}, end_chat={result.end_chat}, should_continue={result.should_continue}, next_node={result.next_node_id}, user_input_waiting={current_node.node_type == NodeType.USER_INPUT and not result.should_continue}")
                    break
                
                # For LLM nodes with continuous execution, don't auto-advance unless specific conditions are met
                if (current_node.node_type == NodeType.LLM and 
                    current_node.config and 
                    current_node.config.get("exit_condition") == "continuous_execution"):
                    logger.info(f"LLM node {current_node.id} with continuous execution - stopping automatic advancement")
                    break
                
                # Move to next node
                current_node = self._find_node_by_id(workflow, result.next_node_id)
                if not current_node:
                    logger.info(f"Next node {result.next_node_id} not found, reached end of workflow")
                    break
                
                # Clear user message after first iteration (subsequent nodes shouldn't use the original user message)
                user_message = None
            
            if not final_result:
                return WorkflowExecutionResult(
                    success=False,
                    message="No execution result",
                    error="No execution result"
                )
            
            # Update session workflow state based on final result
            if (final_result.landing_page_data or 
                final_result.form_data or 
                (current_node and current_node.node_type == NodeType.USER_INPUT and not final_result.should_continue) or
                (current_node and current_node.node_type == NodeType.LLM and not final_result.should_continue and not final_result.transfer_to_human and not final_result.end_chat)):
                # We're displaying a landing page, form, waiting for user input, or staying on LLM node - stay on current node
                self._update_session_workflow_state(session_id, current_node.id if current_node else None, workflow_state)
            elif final_result.transfer_to_human:
                # Transfer to human requested - stay on current node and let the chat handler manage the transfer
                self._update_session_workflow_state(session_id, current_node.id if current_node else None, workflow_state)
                logger.info(f"Transfer to human requested from node {current_node.id if current_node else 'unknown'}, staying on current node")
            else:
                # Normal flow - move to next node (or end workflow if end_chat)
                self._update_session_workflow_state(session_id, final_result.next_node_id, workflow_state)
            
            return WorkflowExecutionResult(
                success=final_result.success,
                message=final_result.message,
                next_node_id=final_result.next_node_id,
                workflow_state=workflow_state,
                should_continue=final_result.should_continue,
                transfer_to_human=final_result.transfer_to_human,
                transfer_group_id=final_result.transfer_group_id,
                transfer_reason=final_result.transfer_reason,
                transfer_description=final_result.transfer_description,
                end_chat=final_result.end_chat,
                request_rating=final_result.request_rating,
                error=final_result.error,
                form_data=final_result.form_data,  # Pass through form_data
                landing_page_data=final_result.landing_page_data,  # Pass through landing_page_data
                intermediate_messages=intermediate_messages # Include collected messages
            )
            
        except Exception as e:
            traceback.print_exc()
            logger.error(f"Error executing workflow: {str(e)}")
            return WorkflowExecutionResult(
                success=False,
                message="An error occurred while executing the workflow",
                error=str(e)
            )
    
    async def submit_form(
        self,
        session_id: str,
        form_data: Dict[str, Any],
        workflow_id: UUID,
        org_id: str = None,
        agent_id: str = None,
        customer_id: str = None,
        api_key: str = None,
        model_name: str = None,
        model_type: str = None,
        source: str = None
    ) -> WorkflowExecutionResult:
        """
        Handle form submission and continue workflow
        
        Args:
            session_id: Session ID
            form_data: Submitted form data
            workflow_id: Workflow ID
            org_id: Organization ID
            agent_id: Agent ID
            customer_id: Customer ID
            api_key: API key for AI model
            model_name: AI model name
            model_type: AI model type
            
        Returns:
            WorkflowExecutionResult with next step
        """
        try:
            logger.info(f"Submitting form for session {session_id}")
            logger.debug(f"Form data: {form_data}")
            logger.debug(f"Workflow ID: {workflow_id}")
            logger.debug(f"Org ID: {org_id}")
            logger.debug(f"Agent ID: {agent_id}")
            logger.debug(f"Customer ID: {customer_id}")
            logger.debug(f"API key: {api_key}")
            # Get current session state
            session = self.session_repo.get_session(session_id)
            if not session:
                return WorkflowExecutionResult(
                    success=False,
                    message="Session not found",
                    error="Session not found"
                )
            
            workflow_state = session.workflow_state or {}
            current_node_id = session.current_node_id
            
            # Validate that we're in a form waiting state
            if workflow_state.get("form_state") != "waiting":
                return WorkflowExecutionResult(
                    success=False,
                    message="No form submission expected",
                    error="No form submission expected"
                )
            
            # Store form submission in workflow state
            workflow_state["form_data"] = form_data
            workflow_state["form_state"] = "submitted"
            
            logger.debug(f"Form submission received for session {session_id}")
            logger.debug(f"Form data: {form_data}")
            logger.debug(f"Updated workflow state: {workflow_state}")
            
            # Continue workflow execution with form submission
            return await self.execute_workflow(
                session_id=session_id,
                user_message="",  # No user message for form submission
                workflow_id=workflow_id,
                current_node_id=current_node_id,
                workflow_state=workflow_state,
                api_key=api_key,
                model_name=model_name,
                model_type=model_type,
                org_id=org_id,
                agent_id=agent_id,
                customer_id=customer_id,
                source=source
            )
            
        except Exception as e:
            logger.error(f"Error submitting form: {str(e)}")
            return WorkflowExecutionResult(
                success=False,
                message="An error occurred while submitting the form",
                error=str(e)
            )
    
    def _find_start_node(self, workflow: Workflow) -> Optional[WorkflowNode]:
        """Find the starting node of a workflow"""
        # Look for a node with no incoming connections
        for node in workflow.nodes:
            if not node.incoming_connections:
                return node
        
        # If no node without incoming connections, return the first node
        return workflow.nodes[0] if workflow.nodes else None
    
    def _find_node_by_id(self, workflow: Workflow, node_id: UUID) -> Optional[WorkflowNode]:
        """Find a node by ID in the workflow"""
        for node in workflow.nodes:
            if node.id == node_id:
                return node
        return None
    
    async def _execute_node(
        self,
        node: WorkflowNode,
        workflow: Workflow,
        workflow_state: Dict[str, Any],
        user_message: str,
        api_key: str,
        model_name: str,
        model_type: str,
        org_id: str,
        agent_id: str,
        customer_id: str,
        session_id: str,
        source: str = None
    ) -> WorkflowExecutionResult:
        """Execute a specific node based on its type"""
        
        logger.info(f"Executing node {node.id} of type {node.node_type}")
        
        try:
            if node.node_type == NodeType.MESSAGE:
                return self._execute_message_node(node, workflow_state)
            
            elif node.node_type == NodeType.LLM:
                return await self._execute_llm_node(
                    node, workflow, workflow_state, user_message, api_key, model_name, 
                    model_type, org_id, agent_id, customer_id, session_id, source
                )
            
            elif node.node_type == NodeType.CONDITION:
                return self._execute_condition_node(node, workflow, workflow_state)
            
            elif node.node_type == NodeType.FORM:
                return self._execute_form_node(node, workflow_state, user_message, session_id)
            
            elif node.node_type == NodeType.LANDING_PAGE:
                return self._execute_landing_page_node(node, workflow_state)
            
            elif node.node_type == NodeType.ACTION:
                return self._execute_action_node(node, workflow_state)
            
            elif node.node_type == NodeType.HUMAN_TRANSFER:
                return self._execute_human_transfer_node(node, workflow_state)
            
            elif node.node_type == NodeType.WAIT:
                return self._execute_wait_node(node, workflow_state)
            
            elif node.node_type == NodeType.END:
                return self._execute_end_node(node, workflow_state)
            
            elif node.node_type == NodeType.USER_INPUT:
                return self._execute_user_input_node(node, workflow_state, user_message, session_id)
            
            else:
                return WorkflowExecutionResult(
                    success=False,
                    message=f"Unknown node type: {node.node_type}",
                    error=f"Unknown node type: {node.node_type}"
                )
                
        except Exception as e:
            logger.error(f"Error executing node {node.id}: {str(e)}")
            return WorkflowExecutionResult(
                success=False,
                message=f"Error executing node: {str(e)}",
                error=str(e)
            )
    
    def _execute_message_node(self, node: WorkflowNode, workflow_state: Dict[str, Any]) -> WorkflowExecutionResult:
        """Execute a message node"""
        config = node.config or {}
        message = config.get("message_text", "No message configured")
        
        # Process variables in message
        message = self._process_variables(message, workflow_state)
        
        # Find next node
        next_node_id = self._find_next_node(node)
        
        return WorkflowExecutionResult(
            success=True,
            message=message,
            next_node_id=next_node_id,
            should_continue=next_node_id is not None
        )
    
    async def _execute_llm_node(
        self,
        node: WorkflowNode,
        workflow: Workflow,
        workflow_state: Dict[str, Any],
        user_message: str,
        api_key: str,
        model_name: str,
        model_type: str,
        org_id: str,
        agent_id: str,
        customer_id: str,
        session_id: str,
        source: str = None
    ) -> WorkflowExecutionResult:
        """Execute an LLM node"""
        try:
            # Check if both user message and workflow history are empty
            if not user_message or user_message.strip() == "":
                # Check if there's any meaningful chat history or workflow history
                chat_repo = ChatRepository(self.db)
                chat_history = chat_repo.get_session_history(session_id)
                workflow_history = self.session_repo.get_workflow_history(session_id)
                
                # If both message and history are empty, skip LLM execution
                if (not chat_history or len(chat_history) == 0) and (not workflow_history or len(workflow_history) == 0):
                    logger.info(f"Skipping LLM node {node.id} execution - no user message and no history available")
                    
                    # Get exit condition to determine how to proceed
                    config = node.config or {}
                    exit_condition = config.get("exit_condition", ExitCondition.SINGLE_EXECUTION)
                    if isinstance(exit_condition, str):
                        try:
                            exit_condition = ExitCondition(exit_condition)
                        except ValueError:
                            exit_condition = ExitCondition.SINGLE_EXECUTION
                    
                    if exit_condition == ExitCondition.SINGLE_EXECUTION:
                        # Single execution: move to next node
                        next_node_id = self._find_next_node(node)
                        return WorkflowExecutionResult(
                            success=True,
                            message="",  # Empty message since no execution occurred
                            next_node_id=next_node_id,
                            should_continue=next_node_id is not None
                        )
                    else:
                        # Continuous execution: wait for user input
                        return WorkflowExecutionResult(
                            success=True,
                            message="",  # Empty message since no execution occurred
                            next_node_id=None,
                            should_continue=False
                        )
            
            # Get system prompt from config and process variables
            config = node.config or {}
            system_prompt = config.get("system_prompt", "You are a helpful assistant.")
            system_prompt = self._process_variables(system_prompt, workflow_state)
            
            # Get exit condition configuration
            exit_condition = config.get("exit_condition", ExitCondition.SINGLE_EXECUTION)
            # Ensure it's an ExitCondition enum value
            if isinstance(exit_condition, str):
                try:
                    exit_condition = ExitCondition(exit_condition)
                except ValueError:
                    exit_condition = ExitCondition.SINGLE_EXECUTION
            
            # Transfer to human setting only applies to continuous execution
            auto_transfer = False
            transfer_group_id = None
            ask_for_rating_config = False
            if exit_condition == ExitCondition.CONTINUOUS_EXECUTION:
                auto_transfer = config.get("auto_transfer_enabled", False)
                transfer_group_id = config.get("transfer_group_id")
                ask_for_rating_config = config.get("ask_for_rating", True)  # Default to True
            
            # Handle empty or null user message by creating structured context
            processed_user_message = user_message
            if not user_message or user_message.strip() == "":
                processed_user_message = self._build_context_message(session_id, workflow_state)
            
            # Create chat agent with custom system prompt
            chat_agent = await ChatAgent.create_async(
                api_key=api_key,
                model_name=model_name,
                model_type=model_type,
                org_id=org_id,
                agent_id=agent_id,
                customer_id=customer_id,
                session_id=session_id,
                custom_system_prompt=system_prompt,
                transfer_to_human=auto_transfer,
                source=source
            )
            
            try:
                # Get response from LLM using the agent's internal method to avoid double message storage
                response = await chat_agent._get_llm_response_only(
                    message=processed_user_message,
                    session_id=session_id,
                    org_id=org_id,
                    agent_id=agent_id,
                    customer_id=customer_id
                )
            finally:
                # Always clean up MCP tools, even if there's an error
                # Use asyncio.create_task to ensure cleanup doesn't block the main flow
                try:
                    cleanup_task = asyncio.create_task(chat_agent.cleanup_mcp_tools())
                    await asyncio.wait_for(cleanup_task, timeout=2.0)
                except asyncio.TimeoutError:
                    logger.debug("MCP cleanup timed out (non-critical)")
                except Exception as cleanup_error:
                    logger.debug(f"MCP cleanup warning in workflow (non-critical): {str(cleanup_error)}")
            
            logger.debug(f"Response: {response}")
            # Handle exit conditions
            next_node_id = None
            should_continue = False
            transfer_to_human = response.transfer_to_human
            end_chat = response.end_chat
            
            if exit_condition == ExitCondition.SINGLE_EXECUTION:
                # Single execution: always move to next node after one response
                next_node_id = self._find_next_node(node)
                should_continue = next_node_id is not None
                logger.info(f"LLM node {node.id} single execution - moving to next node {next_node_id}")
                
            elif exit_condition == ExitCondition.CONTINUOUS_EXECUTION:
                # Continuous execution: stay on current node, only exit on explicit conditions
                if response.transfer_to_human and auto_transfer:
                    # Auto transfer is enabled and LLM requested transfer
                    transfer_to_human = True
                    should_continue = False
                    logger.info(f"LLM node {node.id} auto transfer triggered")
                elif response.end_chat:
                    # LLM requested end chat - move to next node or end workflow
                    next_node_id = self._find_next_node(node)
                    should_continue = next_node_id is not None
                    logger.info(f"LLM node {node.id} end chat requested - moving to next node {next_node_id}")
                else:
                    # Stay on current node for continued conversation
                    should_continue = False
                    next_node_id = None
                    logger.info(f"LLM node {node.id} continuous execution - staying on current node")
            
            # Determine rating request based on config for workflow end chat handling
            request_rating = response.request_rating
            if end_chat and exit_condition == ExitCondition.CONTINUOUS_EXECUTION:
                # For continuous execution, check the ask_for_rating config
                if 'ask_for_rating' in config:
                    request_rating = config['ask_for_rating']
                else:
                    request_rating = True  # Default to True if not specified
                
                # Update the response with the determined rating value
                response.request_rating = request_rating

            return WorkflowExecutionResult(
                success=True,
                message=response.message,
                next_node_id=next_node_id,
                should_continue=should_continue,
                transfer_to_human=transfer_to_human,
                transfer_group_id=transfer_group_id if transfer_to_human else None,
                transfer_reason=response.transfer_reason.value if response.transfer_reason else None,
                transfer_description=response.transfer_description,
                end_chat=end_chat,
                request_rating=request_rating
            )
            
        except Exception as e:
            logger.error(f"Error executing LLM node: {str(e)}")
            return WorkflowExecutionResult(
                success=False,
                message="Sorry, I encountered an error processing your request.",
                error=str(e)
            )
    
    def _execute_condition_node(
        self,
        node: WorkflowNode,
        workflow: Workflow,
        workflow_state: Dict[str, Any]
    ) -> WorkflowExecutionResult:
        """Execute a condition node"""
        try:
            config = node.config or {}
            condition_expression = config.get("condition_expression")
            
            if not condition_expression:
                return WorkflowExecutionResult(
                    success=False,
                    message="No condition expression configured",
                    error="No condition expression configured"
                )
            
            # Evaluate condition
            condition_result = self._evaluate_condition(condition_expression, workflow_state)
            
            # Find next node based on condition result
            next_node_id = self._find_conditional_next_node(node, condition_result)
            
            return WorkflowExecutionResult(
                success=True,
                message="",  # Condition nodes don't produce user-facing messages
                next_node_id=next_node_id,
                should_continue=next_node_id is not None
            )
            
        except Exception as e:
            logger.error(f"Error executing condition node: {str(e)}")
            return WorkflowExecutionResult(
                success=False,
                message="Error evaluating condition",
                error=str(e)
            )
    
    def _execute_form_node(
        self,
        node: WorkflowNode,
        workflow_state: Dict[str, Any],
        user_message: str,
        session_id: str = None
    ) -> WorkflowExecutionResult:
        """Execute a form node"""
        logger.info(f"Executing form node: {node.id}")
        config = node.config or {}
        
        # Get form fields from config (frontend stores them there)
        form_fields = config.get("form_fields", [])
        
        if not form_fields:
            return WorkflowExecutionResult(
                success=False,
                message="No form fields configured",
                error="No form fields"
            )
        
        # Check if we're waiting for form submission
        current_state = workflow_state.get("form_state", "display")
        
        if current_state == "display" or current_state == "waiting":
            # First time hitting form node OR user refreshed while waiting - display the form
            form_data = {
                "title": config.get("form_title", ""),
                "description": config.get("form_description", ""),
                "submit_button_text": config.get("submit_button_text", "Submit"),
                "fields": form_fields,
                "form_full_screen": config.get("form_full_screen", False)
            }
            logger.debug(f"Form data: {form_data}")
            # Mark that we're waiting for form submission
            workflow_state["form_state"] = "waiting"
            
            result = WorkflowExecutionResult(
                success=True,
                message="",  # No text message for form display
                next_node_id=None,  # Don't proceed yet
                should_continue=False,  # Wait for form submission
                form_data=form_data  # Include form data for display
            )
            logger.debug(f"Form result: {result}")
            return result
        elif current_state == "submitted":
            # Form has been submitted, process and continue
            form_submission = workflow_state.get("form_data", {})
            logger.debug(f"Form submission: {form_submission}")
            # Clear form state after processing
            workflow_state.pop("form_state", None)
            workflow_state.pop("form_data", None)
            # Store form submission in workflow history
            self.session_repo.add_workflow_history_entry(session_id, node.id, "form_submission", form_submission)

            # Find next node
            next_node_id = self._find_next_node(node)
            logger.debug(f"Next node ID: {next_node_id}")
            return WorkflowExecutionResult(
                success=True,
                message="",
                next_node_id=next_node_id,
                should_continue=next_node_id is not None
            )
        else:
            # Invalid state - but still try to display the form rather than error
            logger.warning(f"Unknown form state '{current_state}', defaulting to display form")
            form_data = {
                "title": config.get("form_title", ""),
                "description": config.get("form_description", ""),
                "submit_button_text": config.get("submit_button_text", "Submit"),
                "fields": form_fields,
                "form_full_screen": config.get("form_full_screen", False)
            }
            # Reset to waiting state
            workflow_state["form_state"] = "waiting"
            
            return WorkflowExecutionResult(
                success=True,
                message="",
                next_node_id=None,
                should_continue=False,
                form_data=form_data
            )
    
    def _execute_landing_page_node(self, node: WorkflowNode, workflow_state: Dict[str, Any]) -> WorkflowExecutionResult:
        """Execute a landing page node"""
        logger.info(f"Executing landing page node: {node.id}")
        config = node.config or {}
        heading = config.get("landing_page_heading", "Welcome")
        content = config.get("landing_page_content", "Thank you for visiting!")
        
        # Process variables in heading and content
        heading = self._process_variables(heading, workflow_state)
        content = self._process_variables(content, workflow_state)
        
        # Create landing page data
        landing_page_data = {
            "heading": heading,
            "content": content
        }
        
        # Don't find next node immediately - wait for user to proceed
        result = WorkflowExecutionResult(
            success=True,
            message="",  # No text message for landing page display
            next_node_id=None,  # Don't proceed yet
            should_continue=False,  # Wait for user to proceed
            landing_page_data=landing_page_data  # Include landing page data for display
        )
        logger.debug(f"Landing page result: {result}")
        return result
    
    def _execute_action_node(self, node: WorkflowNode, workflow_state: Dict[str, Any]) -> WorkflowExecutionResult:
        """Execute an action node"""
        # This is a simplified implementation
        # In a full implementation, you'd handle webhooks, database operations, etc.
        
        config = node.config or {}
        action_type = config.get("action_type")
        action_config = config.get("action_config", {})
        
        logger.info(f"Executing action: {action_type}")
        
        # Don't store action execution in workflow state to keep it minimal
        
        # Find next node
        next_node_id = self._find_next_node(node)
        
        return WorkflowExecutionResult(
            success=True,
            message="Action completed successfully.",
            next_node_id=next_node_id,
            should_continue=next_node_id is not None
        )
    
    def _execute_human_transfer_node(
        self,
        node: WorkflowNode,
        workflow_state: Dict[str, Any]
    ) -> WorkflowExecutionResult:
        """Execute a human transfer node"""
        config = node.config or {}
        transfer_rules = config.get("transfer_rules", {})
        message = transfer_rules.get("message", "Transferring you to a human agent. Please wait...")
        transfer_group_id = config.get("transfer_group_id")
        
        return WorkflowExecutionResult(
            success=True,
            message=message,
            transfer_to_human=True,
            transfer_group_id=transfer_group_id,
            should_continue=False
        )
    
    def _execute_wait_node(self, node: WorkflowNode, workflow_state: Dict[str, Any]) -> WorkflowExecutionResult:
        """Execute a wait node"""
        # This is a simplified implementation
        # In a full implementation, you'd handle timed waits and conditions
        
        wait_duration = node.wait_duration or 0
        message = f"Please wait {wait_duration} seconds..."
        
        # Find next node
        next_node_id = self._find_next_node(node)
        
        return WorkflowExecutionResult(
            success=True,
            message=message,
            next_node_id=next_node_id,
            should_continue=next_node_id is not None
        )
    
    def _execute_end_node(self, node: WorkflowNode, workflow_state: Dict[str, Any]) -> WorkflowExecutionResult:
        """Execute an end node"""
        config = node.config or {}
        message = config.get("message_text", "Thank you for using our service!")
        
        # Check if we should request rating
        request_rating = config.get("request_rating", False)
        
        return WorkflowExecutionResult(
            success=True,
            message=message,
            end_chat=True,
            request_rating=request_rating,
            should_continue=False
        )
    
    def _execute_user_input_node(
        self,
        node: WorkflowNode,
        workflow_state: Dict[str, Any],
        user_message: str,
        session_id: str = None
    ) -> WorkflowExecutionResult:
        """Execute a user input node"""
        logger.info(f"Executing user input node: {node.id}")
        config = node.config or {}
        
        # Check if we're waiting for user input
        current_state = workflow_state.get("user_input_state", "waiting")
        
        if current_state == "waiting" and (not user_message or user_message.strip() == ""):
            # Still waiting for user input
            prompt_message = config.get("prompt_message", "")
            
            # Only process and display prompt if it exists and is not empty
            if prompt_message and prompt_message.strip():
                prompt_message = self._process_variables(prompt_message, workflow_state)
                message_to_display = prompt_message
            else:
                # No prompt message configured - return empty message
                message_to_display = ""
            
            # Mark that we're waiting for user input
            workflow_state["user_input_state"] = "waiting"
            workflow_state["user_input_node_id"] = str(node.id)
            
            return WorkflowExecutionResult(
                success=True,
                message=message_to_display,
                next_node_id=None,  # Don't proceed yet
                should_continue=False  # Wait for user input
            )
        
        elif current_state == "waiting" and user_message and user_message.strip():
            # User has provided input - process and continue
            user_input = user_message.strip()
            logger.debug(f"User input received: {user_input}")
            
            # Store user input in workflow state temporarily
            workflow_state["user_input_data"] = user_input
            workflow_state["user_input_state"] = "received"
            
            # Store user input in workflow history
            if session_id:
                self.session_repo.add_workflow_history_entry(
                    session_id, 
                    node.id, 
                    "user_input", 
                    {"input": user_input, "node_name": node.name}
                )
            
            # Clear the user input state after processing
            workflow_state.pop("user_input_state", None)
            workflow_state.pop("user_input_node_id", None)
            workflow_state.pop("user_input_data", None)
            
            # Find next node
            next_node_id = self._find_next_node(node)
            logger.debug(f"Next node ID: {next_node_id}")
            
            # Get confirmation message or use default
            confirmation_message = config.get("confirmation_message", "")
            if confirmation_message:
                confirmation_message = self._process_variables(confirmation_message, workflow_state)
                return WorkflowExecutionResult(
                    success=True,
                    message=confirmation_message,
                    next_node_id=next_node_id,
                    should_continue=next_node_id is not None
                )
            else:
                # No confirmation message - proceed silently to next node
                return WorkflowExecutionResult(
                    success=True,
                    message="",
                    next_node_id=next_node_id,
                    should_continue=next_node_id is not None
                )
        else:
            # Invalid state - reset to waiting
            logger.warning(f"Unknown user input state '{current_state}', resetting to waiting")
            prompt_message = config.get("prompt_message", "")
            
            # Only process and display prompt if it exists and is not empty
            if prompt_message and prompt_message.strip():
                prompt_message = self._process_variables(prompt_message, workflow_state)
                message_to_display = prompt_message
            else:
                # No prompt message configured - return empty message
                message_to_display = ""
            
            workflow_state["user_input_state"] = "waiting"
            workflow_state["user_input_node_id"] = str(node.id)
            
            return WorkflowExecutionResult(
                success=True,
                message=message_to_display,
                next_node_id=None,
                should_continue=False
            )
    
    def _find_next_node(self, node: WorkflowNode) -> Optional[UUID]:
        """Find the next node in the workflow"""
        if not node.outgoing_connections:
            return None
        
        # Return the first outgoing connection's target
        # In a more complex implementation, you'd handle multiple connections
        return node.outgoing_connections[0].target_node_id
    

    
    def _find_conditional_next_node(self, node: WorkflowNode, condition_result: bool) -> Optional[UUID]:
        """Find next node based on condition result"""
        if not node.outgoing_connections:
            return None
        
        # Look for connections with appropriate conditions
        for connection in node.outgoing_connections:
            if condition_result and (connection.label == "true" or connection.condition == "true"):
                return connection.target_node_id
            elif not condition_result and (connection.label == "false" or connection.condition == "false"):
                return connection.target_node_id
        
        # If no specific condition found, return first connection
        return node.outgoing_connections[0].target_node_id
    

    
    def _process_variables(self, text: str, variables: Dict[str, Any]) -> str:
        """Process variables in text using {{variable}} syntax"""
        if not text or not variables:
            return text
        
        # Replace {{variable}} with actual values
        for key, value in variables.items():
            placeholder = f"{{{{{key}}}}}"
            text = text.replace(placeholder, str(value))
        
        return text
    
    def _evaluate_condition(self, condition: str, variables: Dict[str, Any]) -> bool:
        """Evaluate a condition expression"""
        # This is a simplified implementation
        # In a full implementation, you'd use a proper expression evaluator
        
        try:
            # Replace variables in condition
            condition = self._process_variables(condition, variables)
            
            # Simple condition evaluation
            if "==" in condition:
                left, right = condition.split("==", 1)
                return left.strip() == right.strip()
            elif "!=" in condition:
                left, right = condition.split("!=", 1)
                return left.strip() != right.strip()
            elif "contains" in condition:
                left, right = condition.split("contains", 1)
                return right.strip() in left.strip()
            else:
                # Default to true for unknown conditions
                return True
                
        except Exception as e:
            logger.error(f"Error evaluating condition: {str(e)}")
            return False
    
    def _update_session_workflow_state(
        self,
        session_id: str,
        next_node_id: Optional[UUID],
        workflow_state: Dict[str, Any]
    ) -> None:
        """Update session with new workflow state"""
        try:
            logger.info(f"Updating session {session_id} with next_node_id: {next_node_id}")
            logger.info(f"Updating session {session_id} with workflow_state: {workflow_state}")
            
            success = self.session_repo.update_workflow_state(session_id, next_node_id, workflow_state)
            if success:
                logger.info(f"Successfully updated session {session_id} workflow state")
            else:
                logger.error(f"Failed to update session {session_id} workflow state")
            
        except Exception as e:
            logger.error(f"Error updating session workflow state: {str(e)}")
    
    def _build_context_message(self, session_id: str, workflow_state: Dict[str, Any]) -> str:
        """
        Build a structured context message when user_message is empty or null.
        Includes chat history and workflow history formatted as instructions for LLM.
        """
        try:
            # Initialize repositories
            chat_repo = ChatRepository(self.db)
            
            # Get chat history for the session
            chat_history = chat_repo.get_session_history(session_id)
            
            # Get workflow history for the session
            workflow_history = self.session_repo.get_workflow_history(session_id)
            
            # Build structured context message
            context_parts = []
            context_parts.append("CONTEXT on previous workflow messages, you can use this along with instructions for understanding context")
            # Add instruction header

            
            # Add chat history section
            if chat_history:
                context_parts.append("CONVERSATION HISTORY:")
                context_parts.append("-" * 25)
                
                for i, message in enumerate(chat_history, 1):
                    timestamp = message.created_at.strftime("%Y-%m-%d %H:%M:%S") if message.created_at else "Unknown"
                    message_type = message.message_type.upper()
                    
                    # Format message with context
                    context_parts.append(f"{i}. [{timestamp}] {message_type}: {message.message}")
                    
                    # Add attributes if they contain useful context
                    if message.attributes:
                        relevant_attrs = {}
                        for key, value in message.attributes.items():
                            if key in ['workflow_execution', 'transfer_to_human', 'end_chat', 'form_submission', 'user_input']:
                                relevant_attrs[key] = value
                        
                        if relevant_attrs:
                            context_parts.append(f"   Context: {relevant_attrs}")
                
                context_parts.append("")
            else:
                context_parts.append("CONVERSATION HISTORY: No previous messages")
                context_parts.append("")
            
            # Add workflow history section
            if workflow_history:
                context_parts.append("WORKFLOW INTERACTION HISTORY:")
                context_parts.append("-" * 35)
                
                for i, entry in enumerate(workflow_history, 1):
                    timestamp = entry.get('timestamp', 'Unknown')
                    entry_type = entry.get('type', 'Unknown')
                    node_id = entry.get('node_id', 'Unknown')
                    data = entry.get('data', {})
                    
                    context_parts.append(f"{i}. [{timestamp}] {entry_type.upper()} (Node: {node_id})")
                    
                    # Format specific data types
                    if entry_type == 'form_submission' and data:
                        context_parts.append(f"   Form Data: {json.dumps(data, indent=6)}")
                    elif entry_type == 'user_input' and data:
                        context_parts.append(f"   User Input: {data}")
                    elif data:
                        context_parts.append(f"   Data: {json.dumps(data, indent=6)}")
                
                context_parts.append("")
            else:
                context_parts.append("WORKFLOW INTERACTION HISTORY: No previous workflow interactions")
                context_parts.append("")
            
            # Add current workflow state
            if workflow_state:
                context_parts.append("CURRENT WORKFLOW STATE:")
                context_parts.append("-" * 27)
                context_parts.append(json.dumps(workflow_state, indent=2))
                context_parts.append("")
            
            # Add analysis instructions

            
            return "\n".join(context_parts)
            
        except Exception as e:
            logger.error(f"Error building context message: {str(e)}")
            # Fallback message
            return ("Please analyze the current conversation context and provide an appropriate response. "
                   "The user has not provided a new message, so please review the conversation history "
                   "and workflow progress to determine the next appropriate action.")

 