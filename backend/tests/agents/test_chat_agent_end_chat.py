"""
ChatterMate - Chat Agent End Chat Tests
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

import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from app.agents.chat_agent import ChatAgent, ChatResponse
from app.models.session_to_agent import SessionStatus
from sqlalchemy.orm import Session


@pytest.fixture
def mock_db():
    mock_session = MagicMock(spec=Session)
    return mock_session


@pytest.fixture
def mock_agent_data():
    agent = Mock()
    agent.ask_for_rating = True  # Default agent setting
    return agent


@pytest.fixture
def chat_agent(mock_agent_data, mock_db):
    from uuid import uuid4
    from unittest.mock import patch, Mock
    
    # Mock the agent data returned by the database
    mock_jira_agent_data = Mock()
    mock_jira_agent_data.jira_enabled = False
    mock_jira_agent_data.transfer_to_human = False
    mock_jira_agent_data.ask_for_rating = True  # Default agent setting
    mock_jira_agent_data.instructions = ["You are a helpful assistant", "Be polite and professional"]
    
    # Mock AI config
    mock_ai_config = Mock()
    mock_ai_config.model_name = "gpt-4"
    mock_ai_config.model_type = "openai"
    mock_ai_config.encrypted_api_key = "test-key"
    
    # Mock AI config repository
    mock_ai_config_repo = Mock()
    mock_ai_config_repo.get_active_config.return_value = mock_ai_config
    
    # Mock knowledge search tool
    mock_knowledge_tool = Mock()
    
    # Mock environment variables
    mock_env = {}
    
    # Mock PostgresAgentStorage
    mock_storage = Mock()
    mock_storage.get_session_state.return_value = {"status": "active"}
    
    with patch('app.agents.chat_agent.get_db') as mock_get_db, \
         patch('app.agents.chat_agent.JiraRepository') as mock_jira_repo, \
         patch('app.tools.knowledge_search_byagent.AIConfigRepository', return_value=mock_ai_config_repo), \
         patch('app.tools.knowledge_search_byagent.KnowledgeSearchByAgent', return_value=mock_knowledge_tool), \
         patch('app.tools.knowledge_search_byagent.decrypt_api_key', return_value="decrypted-test-key"), \
         patch('app.agents.chat_agent.PostgresAgentStorage', return_value=mock_storage), \
         patch('app.agents.chat_agent.settings.DATABASE_URL', "mock://test"), \
         patch.dict('os.environ', mock_env, clear=True):
        
        # Mock database session
        mock_get_db.return_value = iter([mock_db])
        
        # Mock JiraRepository methods
        mock_jira_repo.return_value.get_agent_with_jira_config.return_value = mock_jira_agent_data
        
        agent = ChatAgent(
            api_key="test-key",
            model_name="gpt-4",
            model_type="openai",
            org_id=str(uuid4()),
            agent_id=str(uuid4()),
            customer_id=str(uuid4()),
            session_id=str(uuid4())
        )
        
        # Mock the agent's database session
        agent.db = mock_db
        return agent


@pytest.fixture
def sample_response():
    return ChatResponse(
        message="Thank you for chatting with us. Goodbye!",
        transfer_to_human=False,
        transfer_reason=None,
        transfer_description=None,
        end_chat=True,
        request_rating=False,
        create_ticket=False
    )


class TestChatAgentEndChat:
    
    @pytest.mark.asyncio
    async def test_handle_end_chat_force_rating_true(self, chat_agent, sample_response, mock_db):
        """Test _handle_end_chat with force_rating=True"""
        
        # Mock session repository
        mock_session_repo = Mock()
        
        # Create a fixed datetime for testing
        fixed_datetime = datetime(2025, 7, 25, 23, 30, 11, 457575)
        
        with patch('app.agents.chat_agent.SessionToAgentRepository', return_value=mock_session_repo), \
             patch.object(chat_agent, 'agent_data', None), \
             patch('app.agents.chat_agent.datetime') as mock_datetime:
            # Configure datetime.now() to return our fixed datetime
            mock_datetime.now.return_value = fixed_datetime
            
            result = await chat_agent._handle_end_chat(
                response_content=sample_response,
                session_id=chat_agent.agent.session_id,
                db=mock_db,
                force_rating=True
            )
            
            # Verify rating was forced to True
            assert result.request_rating is True
            assert "Would you please take a moment to rate your experience?" in result.message
            
            # Verify session was updated
            mock_session_repo.update_session.assert_called_once_with(
                chat_agent.agent.session_id,
                {
                    "status": SessionStatus.CLOSED,
                    "end_chat_reason": None,
                    "end_chat_description": None,
                    "closed_at": fixed_datetime
                }
            )
    
    @pytest.mark.asyncio
    async def test_handle_end_chat_force_rating_false(self, chat_agent, sample_response, mock_db):
        """Test _handle_end_chat with force_rating=False"""
        
        # Mock session repository
        mock_session_repo = Mock()
        
        with patch('app.agents.chat_agent.SessionToAgentRepository', return_value=mock_session_repo):
            # Set agent to normally ask for rating, but force it to False
            mock_agent = Mock()
            mock_agent.ask_for_rating = True
            with patch.object(chat_agent, 'agent_data', mock_agent):
                result = await chat_agent._handle_end_chat(
                    response_content=sample_response,
                    session_id=chat_agent.agent.session_id,
                    db=mock_db,
                    force_rating=False
                )
                
                # Verify rating was forced to False despite agent setting
                assert result.request_rating is False
                assert "Would you please take a moment to rate your experience?" not in result.message
                
                # Verify session was updated
                mock_session_repo.update_session.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_handle_end_chat_force_rating_none_uses_agent_default(self, chat_agent, sample_response, mock_db):
        """Test _handle_end_chat with force_rating=None uses agent's default"""
        
        # Mock session repository
        mock_session_repo = Mock()
        
        with patch('app.agents.chat_agent.SessionToAgentRepository', return_value=mock_session_repo):
            # Set agent to ask for rating
            mock_agent = Mock()
            mock_agent.ask_for_rating = True
            with patch.object(chat_agent, 'agent_data', mock_agent):
                result = await chat_agent._handle_end_chat(
                    response_content=sample_response,
                    session_id=chat_agent.agent.session_id,
                    db=mock_db,
                    force_rating=None  # Use agent's default
                )
                
                # Verify agent's default setting was used
                assert result.request_rating is True
                assert "Would you please take a moment to rate your experience?" in result.message
    
    @pytest.mark.asyncio
    async def test_handle_end_chat_force_rating_none_agent_disabled(self, chat_agent, sample_response, mock_db):
        """Test _handle_end_chat with force_rating=None when agent has rating disabled"""
        
        # Mock session repository
        mock_session_repo = Mock()
        
        with patch('app.agents.chat_agent.SessionToAgentRepository', return_value=mock_session_repo):
            # Set agent to not ask for rating
            mock_agent = Mock()
            mock_agent.ask_for_rating = False
            with patch.object(chat_agent, 'agent_data', mock_agent):
                result = await chat_agent._handle_end_chat(
                    response_content=sample_response,
                    session_id=chat_agent.agent.session_id,
                    db=mock_db,
                    force_rating=None  # Use agent's default
                )
                
                # Verify agent's default setting was used
                assert result.request_rating is False
                assert "Would you please take a moment to rate your experience?" not in result.message
    
   
    @pytest.mark.asyncio
    async def test_handle_end_chat_backward_compatibility(self, chat_agent, sample_response, mock_db):
        """Test _handle_end_chat backward compatibility (no force_rating parameter)"""
        
        # Mock session repository
        mock_session_repo = Mock()
        
        with patch('app.agents.chat_agent.SessionToAgentRepository', return_value=mock_session_repo):
            # Set agent to ask for rating
            mock_agent = Mock()
            mock_agent.ask_for_rating = True
            with patch.object(chat_agent, 'agent_data', mock_agent):
                # Call without force_rating parameter (backward compatibility)
                result = await chat_agent._handle_end_chat(
                    response_content=sample_response,
                    session_id=chat_agent.agent.session_id,
                    db=mock_db
                    # No force_rating parameter - should default to None
                )
                
                # Verify agent's default setting was used
                assert result.request_rating is True
                assert "Would you please take a moment to rate your experience?" in result.message 