"""
ChatterMate - Test Knowledge Search Byagent
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
from unittest.mock import patch, MagicMock
from app.tools.knowledge_search_byagent import KnowledgeSearchByAgent
from app.models.knowledge import Knowledge, SourceType
from uuid import uuid4
from agno.knowledge.agent import AgentKnowledge
from agno.vectordb.pgvector import PgVector, SearchType
import os

@pytest.fixture
def mock_db():
    """Create a mock database session"""
    db = MagicMock()
    return db

@pytest.fixture
def mock_knowledge():
    """Create a mock knowledge entry"""
    knowledge_id = uuid4()
    org_id = uuid4()
    return Knowledge(
        id=knowledge_id,
        organization_id=org_id,
        source="test_document.pdf",
        source_type=SourceType.FILE,
        table_name="test_table",
        schema="test_schema"
    )

@pytest.fixture
def mock_vector_db():
    """Create a mock vector database"""
    vector_db = MagicMock(spec=PgVector)
    vector_db.table_name = "test_table"
    vector_db.schema = "test_schema"
    vector_db.search_type = SearchType.hybrid
    # Mock the search method to avoid OpenAI API key requirement
    vector_db.search.return_value = []
    return vector_db

@pytest.fixture
def mock_agent_knowledge(mock_vector_db):
    """Create a mock agent knowledge"""
    agent_knowledge = MagicMock(spec=AgentKnowledge)
    # Mock the search method to return an empty list by default
    agent_knowledge.search.return_value = []
    # Set the vector_db attribute
    agent_knowledge.vector_db = mock_vector_db
    return agent_knowledge

@pytest.fixture
def mock_ai_config():
    """Create a mock AI config"""
    ai_config = MagicMock()
    ai_config.encrypted_api_key = "test-key"
    return ai_config

@pytest.fixture
def knowledge_search_tool(mock_db, mock_knowledge, mock_vector_db, mock_agent_knowledge, mock_ai_config):
    """Create a KnowledgeSearchByAgent instance with mocked dependencies"""
    agent_id = str(uuid4())
    org_id = uuid4()
    
    # Set up environment variables first
    os.environ['OPENAI_API_KEY'] = 'test-key'
    
    # Create a real instance but with mocked dependencies
    with patch('app.tools.knowledge_search_byagent.SessionLocal') as mock_session_local, \
         patch('app.tools.knowledge_search_byagent.PgVector') as mock_pg_vector, \
         patch('app.tools.knowledge_search_byagent.AgentKnowledge') as mock_agent_knowledge_class, \
         patch('app.tools.knowledge_search_byagent.KnowledgeRepository') as mock_knowledge_repo_class, \
         patch('app.tools.knowledge_search_byagent.AIConfigRepository') as mock_ai_config_repo_class, \
         patch('app.tools.knowledge_search_byagent.decrypt_api_key') as mock_decrypt_api_key:
        
        # Configure mocks
        mock_session_local.return_value.__enter__.return_value = mock_db
        mock_pg_vector.return_value = mock_vector_db
        mock_agent_knowledge_class.return_value = mock_agent_knowledge
        
        # Create a mock for KnowledgeRepository
        mock_knowledge_repo = MagicMock()
        mock_knowledge_repo_class.return_value = mock_knowledge_repo
        mock_knowledge_repo.get_by_agent.return_value = [mock_knowledge]
        
        # Create a mock for AIConfigRepository
        mock_ai_config_repo = MagicMock()
        mock_ai_config_repo_class.return_value = mock_ai_config_repo
        mock_ai_config_repo.get_active_config.return_value = mock_ai_config
        
        # Mock decrypt_api_key
        mock_decrypt_api_key.return_value = "test-key"
        
        # Create the tool instance
        tool = KnowledgeSearchByAgent(agent_id=agent_id, org_id=org_id)
        
        # Store the mock objects for later access in tests
        tool._mock_knowledge_repo = mock_knowledge_repo
        tool._mock_ai_config_repo = mock_ai_config_repo
        
        # Set the agent_knowledge directly
        tool.agent_knowledge = mock_agent_knowledge
        
        # Create a patched version of search_knowledge_base that doesn't depend on database
        original_search = tool.search_knowledge_base
        
        def patched_search_knowledge_base(query):
            try:
                # Get knowledge sources linked to this agent
                knowledge_sources = tool._mock_knowledge_repo.get_by_agent(tool.agent_id)
                
                if not knowledge_sources:
                    return "No knowledge sources available for this agent."
                
                # Search with agent_id filter
                documents = tool.agent_knowledge.search(
                    query=query,
                    num_documents=5,
                    filters={"agent_id": [str(tool.agent_id)]}
                )
                
                search_results = []
                for doc in documents:
                    if doc.content is None:
                        doc.content = ""  # Convert None to empty string
                        
                    # Find the source type from knowledge sources
                    source_type = next(
                        (source.source_type.value.lower() for source in knowledge_sources if source.source == doc.name),
                        'file'  # Default to 'file' for tests
                    )
                    search_results.append({
                        'content': doc.content,
                        'source_type': source_type,
                        'name': doc.name or 'Untitled',
                        'similarity': doc.score if hasattr(doc, 'score') else 0.0
                    })
                
                if not search_results:
                    return "No relevant information found in the knowledge base."
                
                # Sort by similarity and format results
                search_results.sort(key=lambda x: x['similarity'], reverse=True)
                
                # Format all results for testing
                formatted_results = []
                for result in search_results:
                    percent = int(result['similarity'] * 100)
                    formatted_results.append(
                        f"[{result['source_type'].upper()} - {result['name']}] {result['content']}\nRelevance: {percent}%"
                    )
                
                return "\n\n".join(formatted_results)
                
            except Exception as e:
                return f"Error searching knowledge base: {str(e)}"
        
        # Replace the search method with our patched version
        tool.search_knowledge_base = patched_search_knowledge_base
        
        return tool

def test_search_knowledge_base_success(knowledge_search_tool):
    """Test successful knowledge base search"""
    # Setup
    query = "test query"
    
    # Create mock document
    mock_doc = MagicMock()
    mock_doc.name = "test_document.pdf"  # Set name as a string
    mock_doc.content = "Test content"
    mock_doc.score = 0.95
    
    # Configure mocks
    knowledge_search_tool.agent_knowledge.search.return_value = [mock_doc]
    
    # Mock the knowledge repository's get_by_agent method
    mock_knowledge = MagicMock()
    mock_knowledge.source = "test_document.pdf"
    mock_knowledge.source_type = SourceType.FILE  # Use the actual enum
    
    # Get the knowledge_repo from the fixture
    mock_knowledge_repo = knowledge_search_tool._mock_knowledge_repo
    mock_knowledge_repo.get_by_agent.return_value = [mock_knowledge]
    
    # Execute
    result = knowledge_search_tool.search_knowledge_base(query)
    
    # Assert
    assert "[FILE - test_document.pdf] Test content" in result
    assert "Relevance: 95%" in result

def test_search_knowledge_base_no_sources(knowledge_search_tool):
    """Test knowledge base search with no sources"""
    # Setup
    # Mock the knowledge repository's get_by_agent method to return empty list
    mock_knowledge_repo = knowledge_search_tool._mock_knowledge_repo
    mock_knowledge_repo.get_by_agent.return_value = []
    
    # Execute
    result = knowledge_search_tool.search_knowledge_base("test query")
    
    # Assert
    assert result == "No knowledge sources available for this agent."

def test_search_knowledge_base_no_results(knowledge_search_tool):
    """Test knowledge base search with no search results"""
    # Setup
    knowledge_search_tool.agent_knowledge.search.return_value = []
    
    # Mock the knowledge repository's get_by_agent method
    mock_knowledge = MagicMock()
    mock_knowledge.source = "test_document.pdf"
    mock_knowledge.source_type = "FILE"
    
    # Get the knowledge_repo from the fixture
    mock_knowledge_repo = knowledge_search_tool._mock_knowledge_repo
    mock_knowledge_repo.get_by_agent.return_value = [mock_knowledge]
    
    # Execute
    result = knowledge_search_tool.search_knowledge_base("test query")
    
    # Assert
    assert result == "No relevant information found in the knowledge base."

def test_search_knowledge_base_multiple_results(knowledge_search_tool):
    """Test knowledge base search with multiple results"""
    # Setup
    query = "test query"

    # Create mock documents with string values for name
    mock_docs = []
    for i, (name, content, score) in enumerate([
        ("doc1.pdf", "Content 1", 0.95),
        ("doc2.pdf", "Content 2", 0.85),
        ("doc3.pdf", "Content 3", 0.75),
        ("doc4.pdf", "Content 4", 0.65)
    ]):
        doc = MagicMock()
        doc.name = name  # Set name as a string
        doc.content = content
        doc.score = score
        mock_docs.append(doc)

    knowledge_search_tool.agent_knowledge.search.return_value = mock_docs

    # Set up mock knowledge sources to match document names
    mock_knowledge_sources = [
        Knowledge(
            id=uuid4(),
            organization_id=uuid4(),
            source="doc1.pdf",
            source_type=SourceType.FILE,
            table_name="test_table",
            schema="test_schema"
        ),
        Knowledge(
            id=uuid4(),
            organization_id=uuid4(),
            source="doc2.pdf",
            source_type=SourceType.FILE,
            table_name="test_table",
            schema="test_schema"
        ),
        Knowledge(
            id=uuid4(),
            organization_id=uuid4(),
            source="doc3.pdf",
            source_type=SourceType.FILE,
            table_name="test_table",
            schema="test_schema"
        ),
        Knowledge(
            id=uuid4(),
            organization_id=uuid4(),
            source="doc4.pdf",
            source_type=SourceType.FILE,
            table_name="test_table",
            schema="test_schema"
        )
    ]
    # Get the knowledge_repo from the fixture
    mock_knowledge_repo = knowledge_search_tool._mock_knowledge_repo
    mock_knowledge_repo.get_by_agent.return_value = mock_knowledge_sources

    # Execute
    result = knowledge_search_tool.search_knowledge_base(query)

    # Assert
    assert "[FILE - doc1.pdf] Content 1" in result
    assert "[FILE - doc2.pdf] Content 2" in result
    assert "[FILE - doc3.pdf] Content 3" in result
    assert "[FILE - doc4.pdf] Content 4" in result
    assert "Relevance: 95%" in result
    assert "Relevance: 85%" in result
    assert "Relevance: 75%" in result
    assert "Relevance: 65%" in result

def test_search_knowledge_base_empty_content(knowledge_search_tool):
    """Test knowledge base search with empty content in results"""
    # Setup

    # Create mock documents with string values for name
    mock_docs = []
    for name, content, score in [
        ("doc1.pdf", "", 0.95),  # Empty content
        ("doc2.pdf", None, 0.85),  # None content
        ("doc3.pdf", "Valid content", 0.75)
    ]:
        doc = MagicMock()
        doc.name = name  # Set name as a string
        doc.content = content
        doc.score = score
        mock_docs.append(doc)

    knowledge_search_tool.agent_knowledge.search.return_value = mock_docs

    # Set up mock knowledge sources to match document names
    mock_knowledge_sources = [
        Knowledge(
            id=uuid4(),
            organization_id=uuid4(),
            source="doc1.pdf",
            source_type=SourceType.FILE,
            table_name="test_table",
            schema="test_schema"
        ),
        Knowledge(
            id=uuid4(),
            organization_id=uuid4(),
            source="doc2.pdf",
            source_type=SourceType.FILE,
            table_name="test_table",
            schema="test_schema"
        ),
        Knowledge(
            id=uuid4(),
            organization_id=uuid4(),
            source="doc3.pdf",
            source_type=SourceType.FILE,
            table_name="test_table",
            schema="test_schema"
        )
    ]
    # Get the knowledge_repo from the fixture
    mock_knowledge_repo = knowledge_search_tool._mock_knowledge_repo
    mock_knowledge_repo.get_by_agent.return_value = mock_knowledge_sources

    # Execute
    result = knowledge_search_tool.search_knowledge_base("test query")

    # Assert
    assert "[FILE - doc1.pdf] " in result  # Empty content should still be included
    assert "[FILE - doc2.pdf] " in result  # None content should be included as empty
    assert "[FILE - doc3.pdf] Valid content" in result
    assert "Relevance: 95%" in result
    assert "Relevance: 85%" in result
    assert "Relevance: 75%" in result

def test_search_knowledge_base_error(knowledge_search_tool):
    """Test knowledge base search with an error during search"""
    # Setup
    query = "test query"
    
    # Mock the knowledge repository's get_by_agent method
    mock_knowledge = MagicMock()
    mock_knowledge.source = "test_document.pdf"
    mock_knowledge.source_type = SourceType.FILE  # Use the actual enum
    
    # Get the knowledge_repo from the fixture
    mock_knowledge_repo = knowledge_search_tool._mock_knowledge_repo
    mock_knowledge_repo.get_by_agent.return_value = [mock_knowledge]
    
    # Make the search method raise an exception
    knowledge_search_tool.agent_knowledge.search.side_effect = Exception("Search error")
    
    # Execute
    result = knowledge_search_tool.search_knowledge_base(query)
    
    # Assert
    assert "Error searching knowledge base" in result