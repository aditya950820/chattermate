"""
ChatterMate - Tests for Optimized PgVector
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
from unittest.mock import MagicMock, patch
import numpy as np

from agno.document import Document
from app.knowledge.optimized_pgvector import OptimizedPgVector


class TestOptimizedPgVector:
    """Test cases for OptimizedPgVector"""
    
    @pytest.fixture
    def mock_embedder(self):
        """Create a mock embedder"""
        mock = MagicMock()
        mock.get_embedding.return_value = np.array([0.1, 0.2, 0.3])
        mock.dimensions = 3
        return mock
    
    @pytest.fixture
    def mock_session(self):
        """Create a mock database session"""
        mock = MagicMock()
        # Configure session to return a context manager
        mock.return_value.__enter__.return_value = mock
        return mock
    
    @patch('sqlalchemy.engine.create_engine')
    def test_init(self, mock_create_engine, mock_embedder):
        """Test initialization"""
        # Arrange
        mock_engine = MagicMock()
        mock_create_engine.return_value = mock_engine
        
        # Act
        db = OptimizedPgVector(
            table_name="test_table",
            db_url="postgresql+psycopg://user:pass@localhost/testdb",
            embedder=mock_embedder
        )
        
        # Assert
        assert db.table_name == "test_table"
        assert db.embedder == mock_embedder
        assert db.dimensions == 3
    
    @patch('sqlalchemy.engine.create_engine')
    def test_upsert_with_pre_embedded_documents(self, mock_create_engine, mock_embedder, mock_session):
        """Test upserting pre-embedded documents"""
        # Arrange
        mock_engine = MagicMock()
        mock_create_engine.return_value = mock_engine
        
        db = OptimizedPgVector(
            table_name="test_table",
            db_url="postgresql+psycopg://user:pass@localhost/testdb",
            embedder=mock_embedder
        )
        db.Session = mock_session
        db._clean_content = lambda x: x  # Mock the content cleaning function
        
        # Create a document with an existing embedding
        pre_embedded_doc = Document(
            id="test1",
            name="Test Document 1",
            content="This is a test document",
            embedding=np.array([0.5, 0.6, 0.7])
        )
        
        # Create a document without an embedding
        unembedded_doc = Document(
            id="test2",
            name="Test Document 2",
            content="This is another test document"
        )
        
        # Mock the document's embed method
        with patch.object(Document, 'embed') as mock_embed:
            # Act
            with patch('sqlalchemy.dialects.postgresql.insert') as mock_insert:
                mock_insert.return_value.on_conflict_do_update.return_value = "upsert_stmt"
                db.upsert([pre_embedded_doc, unembedded_doc])
            
            # Assert
            # The document's embed method should be called for the unembedded document
            mock_embed.assert_called_once_with(embedder=mock_embedder)
            
            # Both documents should be passed to the upsert statement
            assert mock_session.execute.call_count == 1
        
    @patch('sqlalchemy.engine.create_engine')
    def test_insert_with_pre_embedded_documents(self, mock_create_engine, mock_embedder, mock_session):
        """Test inserting pre-embedded documents"""
        # Arrange
        mock_engine = MagicMock()
        mock_create_engine.return_value = mock_engine
        
        db = OptimizedPgVector(
            table_name="test_table",
            db_url="postgresql+psycopg://user:pass@localhost/testdb",
            embedder=mock_embedder
        )
        db.Session = mock_session
        db._clean_content = lambda x: x  # Mock the content cleaning function
        
        # Create a document with an existing embedding
        pre_embedded_doc = Document(
            id="test1",
            name="Test Document 1",
            content="This is a test document",
            embedding=np.array([0.5, 0.6, 0.7])
        )
        
        # Create a document without an embedding
        unembedded_doc = Document(
            id="test2",
            name="Test Document 2",
            content="This is another test document"
        )
        
        # Mock the document's embed method
        with patch.object(Document, 'embed') as mock_embed:
            # Act
            with patch('sqlalchemy.dialects.postgresql.insert') as mock_insert:
                db.insert([pre_embedded_doc, unembedded_doc])
            
            # Assert
            # The document's embed method should be called for the unembedded document
            mock_embed.assert_called_once_with(embedder=mock_embedder)
            
            # Both documents should be passed to the insert statement
            assert mock_session.execute.call_count == 1


if __name__ == "__main__":
    pytest.main(["-v", "test_optimized_pgvector.py"]) 