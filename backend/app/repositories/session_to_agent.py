"""
ChatterMate - Session To Agent
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

from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.session_to_agent import SessionToAgent, SessionStatus
from uuid import UUID
from datetime import datetime
from app.core.logger import get_logger
from sqlalchemy import or_

from app.models.user import User

logger = get_logger(__name__)

class SessionToAgentRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_session(self, session_id: UUID | str, agent_id: UUID | str = None, customer_id: UUID | str = None, user_id: UUID | str = None, organization_id: UUID | str = None) -> SessionToAgent:
        """Create a new session assignment"""
        try:
            workflow_id = None
            
            # Check if agent has an active workflow (only if agent_id is provided)
            if agent_id is not None:
                from app.models.agent import Agent
                agent = self.db.query(Agent).filter(Agent.id == agent_id).first()
                
                if agent:
                    logger.info(f"Agent {agent_id} has use_workflow: {agent.use_workflow} and active_workflow_id: {agent.active_workflow_id}")
                    if agent.use_workflow and agent.active_workflow_id:
                        workflow_id = agent.active_workflow_id
                        logger.info(f"Agent {agent_id} has active workflow {workflow_id}, adding to session")
            
            session = SessionToAgent(
                session_id=session_id,
                agent_id=agent_id,
                customer_id=customer_id,
                user_id=user_id,
                organization_id=organization_id,
                status=SessionStatus.OPEN,
                workflow_id=workflow_id
            )
            self.db.add(session)
            self.db.commit()
            self.db.refresh(session)
            return session
        except Exception as e:
            logger.error(f"Error creating session: {str(e)}")
            self.db.rollback()
            raise

    def get_session(self, session_id: UUID | str) -> Optional[SessionToAgent]:
        """Get session by ID"""
        try:
            if isinstance(session_id, str):
                session_id = UUID(session_id)
            return self.db.query(SessionToAgent).filter(
                SessionToAgent.session_id == session_id
            ).first()
        except Exception as e:
            logger.error(f"Error getting session: {str(e)}")
            return None

    def assign_user(self, session_id: UUID | str, user_id: UUID | str) -> bool:
        """Assign a user to a session"""
        try:
            session = self.get_session(session_id)
            if not session:
                return False
            
            session.user_id = user_id
            session.status = SessionStatus.TRANSFERRED
            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Error assigning user to session: {str(e)}")
            self.db.rollback()
            return False

    def close_session(self, session_id: UUID | str) -> bool:
        """Close a session"""
        try:
            session = self.get_session(session_id)
            if not session:
                return False
            
            session.status = SessionStatus.CLOSED
            session.closed_at = datetime.utcnow()
            self.db.commit()
            return True
        except Exception as e:
            logger.error(f"Error closing session: {str(e)}")
            self.db.rollback()
            return False

    def get_agent_sessions(self, agent_id: UUID | str, status: SessionStatus = None) -> List[SessionToAgent]:
        """Get all sessions for an agent"""
        try:
            query = self.db.query(SessionToAgent).filter(
                SessionToAgent.agent_id == agent_id
            )
            if status:
                query = query.filter(SessionToAgent.status == status)
            return query.all()
        except Exception as e:
            logger.error(f"Error getting agent sessions: {str(e)}")
            return []

    def get_user_sessions(self, user_id: UUID | str, status: SessionStatus = None) -> List[SessionToAgent]:
        """Get all sessions assigned to a user"""
        try:
            query = self.db.query(SessionToAgent).filter(
                SessionToAgent.user_id == user_id
            )
            if status:
                query = query.filter(SessionToAgent.status == status)
            return query.all()
        except Exception as e:
            logger.error(f"Error getting user sessions: {str(e)}")
            return []

    def get_open_sessions(self) -> List[SessionToAgent]:
        """Get all open sessions"""
        try:
            return self.db.query(SessionToAgent).filter(
                SessionToAgent.status == SessionStatus.OPEN
            ).all()
        except Exception as e:
            logger.error(f"Error getting open sessions: {str(e)}")
            return []

    def get_customer_sessions(self, customer_id: UUID | str, status: SessionStatus = None) -> List[SessionToAgent]:
        """Get all sessions for a customer"""
        try:
            query = self.db.query(
                SessionToAgent,
                User.full_name.label('user_full_name'),
                User.profile_pic.label('user_profile_pic')
            ).outerjoin(
                User, SessionToAgent.user_id == User.id
            ).filter(
                SessionToAgent.customer_id == customer_id
            )
            if status:
                query = query.filter(SessionToAgent.status == status)

            return query.order_by(SessionToAgent.assigned_at.desc()).all()
        except Exception as e:
            logger.error(f"Error getting customer sessions: {str(e)}")
            return []

    def get_active_customer_session(self, customer_id: UUID | str, agent_id: UUID | str = None) -> Optional[SessionToAgent]:
        """Get active session for a customer"""
        try:
            query = self.db.query(SessionToAgent).filter(
                SessionToAgent.customer_id == customer_id,
                or_(
                    SessionToAgent.status == SessionStatus.OPEN,
                    SessionToAgent.status == SessionStatus.TRANSFERRED
                )
            )
            if agent_id:
                query = query.filter(SessionToAgent.agent_id == agent_id)
            
            return query.order_by(SessionToAgent.assigned_at.desc()).first()
        except Exception as e:
            logger.error(f"Error getting active customer session: {str(e)}")
            return None

    def get_agent_customer_sessions(self, agent_id: UUID | str, customer_id: UUID | str, status: SessionStatus = None) -> List[SessionToAgent]:
        """Get all sessions between an agent and customer"""
        try:
            query = self.db.query(SessionToAgent).filter(
                SessionToAgent.agent_id == agent_id,
                SessionToAgent.customer_id == customer_id
            )
            if status:
                query = query.filter(SessionToAgent.status == status)
            
            return query.order_by(SessionToAgent.assigned_at.desc()).all()
        except Exception as e:
            logger.error(f"Error getting agent-customer sessions: {str(e)}")
            return []

    def reopen_closed_session(self, session_id: UUID | str) -> bool:
        """Reopen a closed session"""
        try:
            session = self.get_session(session_id)
            if not session:
                return False
            
            if session.status == SessionStatus.CLOSED:
                session.status = SessionStatus.OPEN
                self.db.commit()
                return True
            return False  # Session was not closed
        except Exception as e:
            logger.error(f"Error reopening session: {str(e)}")
            self.db.rollback()
            return False
            
    def get_latest_customer_session(self, customer_id: UUID | str, agent_id: UUID | str = None) -> Optional[SessionToAgent]:
        """Get the latest session for a customer regardless of status"""
        try:
            query = self.db.query(SessionToAgent).filter(
                SessionToAgent.customer_id == customer_id
            )
            if agent_id:
                query = query.filter(SessionToAgent.agent_id == agent_id)
            
            return query.order_by(SessionToAgent.assigned_at.desc()).first()
        except Exception as e:
            logger.error(f"Error getting latest customer session: {str(e)}")
            return None

    def update_session(self, session_id: UUID | str, data: dict) -> bool:
        """Update a session"""
        try:
            session = self.get_session(session_id)
            if not session:
                logger.error(f"Session {session_id} not found for update")
                return False
            
            logger.info(f"Updating session {session_id} with data: {data}")
            
            # Direct assignment instead of setattr for better SQLAlchemy JSON handling
            if 'workflow_state' in data:
                session.workflow_state = data['workflow_state']
                logger.info(f"Set workflow_state = {data['workflow_state']}")
                
            if 'current_node_id' in data:
                session.current_node_id = data['current_node_id']
                logger.info(f"Set current_node_id = {data['current_node_id']}")
                
            # Handle other fields with setattr
            for key, value in data.items():
                if key not in ['workflow_state', 'current_node_id']:
                    setattr(session, key, value)
                    logger.info(f"Set {key} = {value}")
            
            # Mark the session as dirty to ensure SQLAlchemy tracks the changes
            self.db.flush()
            self.db.commit()
            
            # Verify the update by refreshing from database
            self.db.refresh(session)
            logger.info(f"Session after update - workflow_state: {session.workflow_state}")
            logger.info(f"Session after update - current_node_id: {session.current_node_id}")
            
            return True
        except Exception as e:
            logger.error(f"Error updating session: {str(e)}")
            self.db.rollback()
            return False

    def takeover_session(self, session_id: str, user_id: str) -> bool:
        """Take over a chat session"""
        try:
            session = self.get_session(session_id)
            if not session:
                return False

            # Check if session is already taken
            if session.user_id is not None:
                return False

            # Update session
            session.user_id = UUID(user_id)
            session.group_id = None  # Remove group assignment
            session.status = SessionStatus.OPEN  # Keep status as open
            
            self.db.commit()
            return True
            
        except Exception as e:
            logger.error(f"Error taking over session: {str(e)}")
            self.db.rollback()
            return False

    def update_workflow_state(self, session_id: UUID | str, current_node_id: Optional[UUID], workflow_state: dict) -> bool:
        """Update workflow state and current node for a session"""
        try:
            from sqlalchemy.orm.attributes import flag_modified
            
            session = self.get_session(session_id)
            if not session:
                logger.error(f"Session {session_id} not found for workflow state update")
                return False
            
            logger.info(f"Updating workflow state for session {session_id}")
            logger.info(f"Setting current_node_id to: {current_node_id}")
            logger.info(f"Setting workflow_state to: {workflow_state}")
            
            # Update fields
            session.current_node_id = current_node_id
            session.workflow_state = workflow_state.copy() if workflow_state else {}
            session.updated_at = datetime.utcnow()
            
            # Explicitly mark JSON field as modified for SQLAlchemy
            flag_modified(session, 'workflow_state')
            
            # Commit changes
            self.db.commit()
            self.db.refresh(session)
            
            # Verify the update
            logger.info(f"Verified - current_node_id: {session.current_node_id}")
            logger.info(f"Verified - workflow_state: {session.workflow_state}")
            
            return True
        except Exception as e:
            logger.error(f"Error updating workflow state: {str(e)}")
            self.db.rollback()
            return False

    def update_session_status(self, session_id: UUID | str, status: str) -> Optional[SessionToAgent]:
        """Update the status of a session"""
        try:
            session = self.db.query(SessionToAgent).filter(SessionToAgent.session_id == session_id).first()
            if not session:
                logger.error(f"Session {session_id} not found")
                return None
                
            # Convert string status to enum if needed
            if isinstance(status, str):
                try:
                    status = SessionStatus[status]
                except KeyError:
                    logger.error(f"Invalid session status: {status}")
                    return None
            
            session.status = status
            session.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(session)
            logger.info(f"Updated session {session_id} status to {status}")
            return session
        except Exception as e:
            logger.error(f"Error updating session status: {str(e)}")
            self.db.rollback()
            return None

    def add_workflow_history_entry(self, session_id: UUID | str, node_id: UUID | str, entry_type: str, data: dict) -> bool:
        """Add an entry to the workflow history"""
        try:
            from sqlalchemy.orm.attributes import flag_modified
            
            session = self.get_session(session_id)
            if not session:
                logger.error(f"Session {session_id} not found for workflow history update")
                return False
            
            # Initialize workflow_history if None
            if session.workflow_history is None:
                session.workflow_history = []
            
            # Create history entry
            history_entry = {
                "node_id": str(node_id),
                "type": entry_type,
                "timestamp": datetime.utcnow().isoformat(),
                "data": data
            }
            
            # Add to history
            session.workflow_history.append(history_entry)
            
            # Mark as modified for SQLAlchemy
            flag_modified(session, 'workflow_history')
            
            # Commit changes
            self.db.commit()
            self.db.refresh(session)
            
            logger.info(f"Added workflow history entry for session {session_id}: {entry_type}")
            return True
        except Exception as e:
            logger.error(f"Error adding workflow history entry: {str(e)}")
            self.db.rollback()
            return False
    
    def get_workflow_history(self, session_id: UUID | str) -> list:
        """Get the workflow history for a session"""
        try:
            session = self.get_session(session_id)
            if not session:
                logger.error(f"Session {session_id} not found")
                return []
            
            return session.workflow_history or []
        except Exception as e:
            logger.error(f"Error getting workflow history: {str(e)}")
            return []
