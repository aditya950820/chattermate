"""
ChatterMate - Test Workflow Node Service
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
from unittest.mock import Mock, MagicMock, patch
from uuid import uuid4, UUID
from app.services.workflow_node import WorkflowNodeService, sanitize_utf8_text
from app.models.workflow_node import WorkflowNode, NodeType
from app.models.workflow_connection import WorkflowConnection
from app.models.workflow import Workflow, WorkflowStatus
from app.models.organization import Organization
from app.models.user import User


@pytest.fixture
def test_organization(db):
    """Create a test organization"""
    organization = Organization(
        id=uuid4(),
        name="Test Organization",
        domain="test.com"
    )
    db.add(organization)
    db.commit()
    db.refresh(organization)
    return organization


@pytest.fixture
def test_user(db, test_organization):
    """Create a test user"""
    user = User(
        id=uuid4(),
        email="test@example.com",
        hashed_password="hashed_password",
        is_active=True,
        organization_id=test_organization.id,
        full_name="Test User"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def test_workflow(db, test_organization, test_user):
    """Create a test workflow"""
    workflow = Workflow(
        id=uuid4(),
        name="Test Workflow",
        description="Test workflow",
        status=WorkflowStatus.PUBLISHED,
        version=1,
        is_template=False,
        default_language="en",
        canvas_data={
            "nodes": [
                {
                    "id": "start",
                    "type": "message",
                    "data": {"label": "Start"}
                }
            ]
        },
        settings={},
        organization_id=test_organization.id,
        created_by=test_user.id
    )
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow


@pytest.fixture
def test_workflow_node(db, test_workflow):
    """Create a test workflow node"""
    node = WorkflowNode(
        id=uuid4(),
        workflow_id=test_workflow.id,
        node_type=NodeType.MESSAGE,
        name="Start Node",
        position_x=100,
        position_y=100,
        config={"label": "Start Node"}
    )
    db.add(node)
    db.commit()
    db.refresh(node)
    return node


@pytest.fixture
def test_workflow_connection(db, test_workflow):
    """Create a test workflow connection"""
    source_node = WorkflowNode(
        id=uuid4(),
        workflow_id=test_workflow.id,
        node_type=NodeType.MESSAGE,
        name="Source Node",
        position_x=100,
        position_y=100,
        config={}
    )
    target_node = WorkflowNode(
        id=uuid4(),
        workflow_id=test_workflow.id,
        node_type=NodeType.END,
        name="Target Node",
        position_x=200,
        position_y=200,
        config={}
    )
    db.add(source_node)
    db.add(target_node)
    db.flush()
    
    connection = WorkflowConnection(
        id=uuid4(),
        workflow_id=test_workflow.id,
        source_node_id=source_node.id,
        target_node_id=target_node.id,
        label="Test Connection"
    )
    db.add(connection)
    db.commit()
    db.refresh(connection)
    return connection


@pytest.fixture
def workflow_node_service(db):
    """Create WorkflowNodeService instance"""
    return WorkflowNodeService(db)


class TestSanitizeUtf8Text:
    """Test the sanitize_utf8_text utility function"""
    
    def test_sanitize_utf8_text_normal_text(self):
        """Test sanitization with normal text"""
        text = "Hello World"
        result = sanitize_utf8_text(text)
        assert result == "Hello World"
    
    def test_sanitize_utf8_text_with_surrogates(self):
        """Test sanitization with surrogate characters"""
        text = "Hello\udcac\udd16World"
        result = sanitize_utf8_text(text)
        assert result == "HelloWorld"
    
    def test_sanitize_utf8_text_empty_string(self):
        """Test sanitization with empty string"""
        text = ""
        result = sanitize_utf8_text(text)
        assert result == ""
    
    def test_sanitize_utf8_text_none(self):
        """Test sanitization with None"""
        text = None
        result = sanitize_utf8_text(text)
        assert result is None
    
    def test_sanitize_utf8_text_with_unicode_error(self):
        """Test sanitization when unicode error occurs during encoding"""
        # Test with a string that will trigger the UnicodeError exception handling
        text = "test with unicode issues"
        
        # Test that the function handles encoding errors gracefully by testing the fallback path
        # We create a mock that will fail on encode but allow re.sub to work
        with patch('app.services.workflow_node.re.sub', side_effect=lambda pattern, replacement, text: text):
            # Use a text object that will raise UnicodeError when encode() is called
            class MockString(str):
                def encode(self, encoding='utf-8', errors='strict'):
                    if errors == 'ignore':
                        return b'fallback_text'
                    else:
                        raise UnicodeError("Mock encoding error")
                
                def decode(self, encoding='utf-8'):
                    return "fallback_text"
            
            mock_text = MockString(text)
            result = sanitize_utf8_text(mock_text)
            
            # Function should handle the error gracefully and return a string
            assert isinstance(result, str)


class TestWorkflowNodeService:
    
    def test_workflow_node_created_successfully(self, test_workflow_node, test_workflow):
        """Test that workflow node is created with the right properties"""
        assert test_workflow_node.workflow_id == test_workflow.id
        assert test_workflow_node.node_type == NodeType.MESSAGE
        assert test_workflow_node.name == "Start Node"
        assert test_workflow_node.position_x == 100
        assert test_workflow_node.position_y == 100
    
    def test_node_type_enum_values(self):
        """Test that NodeType enum has the expected values"""
        assert hasattr(NodeType, 'MESSAGE')
        assert hasattr(NodeType, 'LLM')
        assert hasattr(NodeType, 'CONDITION')
        assert hasattr(NodeType, 'FORM')
        assert hasattr(NodeType, 'ACTION')
        assert hasattr(NodeType, 'HUMAN_TRANSFER')
        assert hasattr(NodeType, 'WAIT')
        assert hasattr(NodeType, 'END')
        assert hasattr(NodeType, 'LANDING_PAGE')
    
    def test_workflow_node_service_initialization(self, workflow_node_service):
        """Test that WorkflowNodeService can be initialized"""
        assert workflow_node_service is not None
        assert hasattr(workflow_node_service, 'db')
    
    def test_workflow_node_model_fields(self, test_workflow_node):
        """Test that WorkflowNode model has expected fields"""
        assert hasattr(test_workflow_node, 'id')
        assert hasattr(test_workflow_node, 'workflow_id')
        assert hasattr(test_workflow_node, 'node_type')
        assert hasattr(test_workflow_node, 'name')
        assert hasattr(test_workflow_node, 'description')
        assert hasattr(test_workflow_node, 'position_x')
        assert hasattr(test_workflow_node, 'position_y')
        assert hasattr(test_workflow_node, 'config')
        assert hasattr(test_workflow_node, 'created_at')
        assert hasattr(test_workflow_node, 'updated_at')
    
    def test_workflow_node_relationships(self, test_workflow_node):
        """Test that WorkflowNode model has expected relationships"""
        assert hasattr(test_workflow_node, 'workflow')
        assert hasattr(test_workflow_node, 'outgoing_connections')
        assert hasattr(test_workflow_node, 'incoming_connections')
    
    def test_workflow_node_config_structure(self, test_workflow_node):
        """Test that the workflow node config is properly structured"""
        assert isinstance(test_workflow_node.config, dict)
        assert test_workflow_node.config.get("label") == "Start Node"
    
    def test_get_workflow_nodes_and_connections_success(self, workflow_node_service, test_workflow, test_organization):
        """Test getting workflow nodes and connections successfully"""
        result = workflow_node_service.get_workflow_nodes_and_connections(
            test_workflow.id, test_organization.id
        )
        
        assert "nodes" in result
        assert "connections" in result
        assert isinstance(result["nodes"], list)
        assert isinstance(result["connections"], list)
    
    def test_get_workflow_nodes_and_connections_workflow_not_found(self, workflow_node_service, test_organization):
        """Test getting workflow nodes and connections with non-existent workflow"""
        non_existent_id = uuid4()
        
        with pytest.raises(ValueError, match="Workflow not found"):
            workflow_node_service.get_workflow_nodes_and_connections(
                non_existent_id, test_organization.id
            )
    
    def test_get_workflow_nodes_and_connections_wrong_organization(self, workflow_node_service, test_workflow):
        """Test getting workflow nodes and connections with wrong organization"""
        wrong_org_id = uuid4()
        
        with pytest.raises(ValueError, match="Workflow does not belong to your organization"):
            workflow_node_service.get_workflow_nodes_and_connections(
                test_workflow.id, wrong_org_id
            )
    
    def test_update_single_node_success(self, workflow_node_service, test_workflow_node, test_organization):
        """Test updating a single node successfully"""
        update_data = {
            "name": "Updated Node Name",
            "description": "Updated description",
            "config": {"new_field": "new_value"}
        }
        
        result = workflow_node_service.update_single_node(
            test_workflow_node.workflow_id,
            test_workflow_node.id,
            update_data,
            test_organization.id
        )
        
        assert result is not None
        assert result.name == "Updated Node Name"
        assert result.description == "Updated description"
    
    def test_update_single_node_workflow_not_found(self, workflow_node_service, test_workflow_node, test_organization):
        """Test updating node with non-existent workflow"""
        non_existent_workflow_id = uuid4()
        
        with pytest.raises(ValueError, match="Workflow not found"):
            workflow_node_service.update_single_node(
                non_existent_workflow_id,
                test_workflow_node.id,
                {"name": "New Name"},
                test_organization.id
            )
    
    def test_update_single_node_wrong_organization(self, workflow_node_service, test_workflow_node):
        """Test updating node with wrong organization"""
        wrong_org_id = uuid4()
        
        with pytest.raises(ValueError, match="Workflow does not belong to your organization"):
            workflow_node_service.update_single_node(
                test_workflow_node.workflow_id,
                test_workflow_node.id,
                {"name": "New Name"},
                wrong_org_id
            )
    
    def test_update_single_node_node_not_found(self, workflow_node_service, test_workflow, test_organization):
        """Test updating non-existent node"""
        non_existent_node_id = uuid4()
        
        with pytest.raises(ValueError, match="Node not found"):
            workflow_node_service.update_single_node(
                test_workflow.id,
                non_existent_node_id,
                {"name": "New Name"},
                test_organization.id
            )
    
    def test_update_single_node_wrong_workflow(self, workflow_node_service, test_workflow_node, test_organization, db, test_user):
        """Test updating node that belongs to different workflow"""
        # Create another workflow
        other_workflow = Workflow(
            id=uuid4(),
            name="Other Workflow",
            description="Other workflow",
            status=WorkflowStatus.PUBLISHED,
            version=1,
            is_template=False,
            default_language="en",
            canvas_data={},
            settings={},
            organization_id=test_organization.id,
            created_by=test_user.id
        )
        db.add(other_workflow)
        db.commit()
        
        with pytest.raises(ValueError, match="Node does not belong to this workflow"):
            workflow_node_service.update_single_node(
                other_workflow.id,
                test_workflow_node.id,
                {"name": "New Name"},
                test_organization.id
            )
    
    def test_get_single_node_success(self, workflow_node_service, test_workflow_node, test_organization):
        """Test getting a single node successfully"""
        result = workflow_node_service.get_single_node(
            test_workflow_node.workflow_id,
            test_workflow_node.id,
            test_organization.id
        )
        
        assert result is not None
        assert result.id == test_workflow_node.id
        assert result.name == test_workflow_node.name
    
    def test_get_single_node_workflow_not_found(self, workflow_node_service, test_workflow_node, test_organization):
        """Test getting node with non-existent workflow"""
        non_existent_workflow_id = uuid4()
        
        with pytest.raises(ValueError, match="Workflow not found"):
            workflow_node_service.get_single_node(
                non_existent_workflow_id,
                test_workflow_node.id,
                test_organization.id
            )
    
    def test_get_single_node_wrong_organization(self, workflow_node_service, test_workflow_node):
        """Test getting node with wrong organization"""
        wrong_org_id = uuid4()
        
        with pytest.raises(ValueError, match="Workflow does not belong to your organization"):
            workflow_node_service.get_single_node(
                test_workflow_node.workflow_id,
                test_workflow_node.id,
                wrong_org_id
            )
    
    def test_get_single_node_node_not_found(self, workflow_node_service, test_workflow, test_organization):
        """Test getting non-existent node"""
        non_existent_node_id = uuid4()
        
        with pytest.raises(ValueError, match="Node not found"):
            workflow_node_service.get_single_node(
                test_workflow.id,
                non_existent_node_id,
                test_organization.id
            )
    
    def test_replace_workflow_nodes_and_connections_success(self, workflow_node_service, test_workflow, test_organization):
        """Test replacing workflow nodes and connections successfully"""
        nodes_data = [
            {
                "id": str(uuid4()),  # Use proper UUID strings
                "node_type": "message",
                "name": "Test Message Node",
                "position_x": 100,
                "position_y": 100,
                "message_text": "Hello World",
                "config": {}
            },
            {
                "id": str(uuid4()),  # Use proper UUID strings
                "node_type": "end",
                "name": "Test End Node",
                "position_x": 200,
                "position_y": 200,
                "final_message": "Goodbye",
                "config": {}
            }
        ]
        
        connections_data = [
            {
                "id": str(uuid4()),  # Use proper UUID strings
                "source_node_id": nodes_data[0]["id"],
                "target_node_id": nodes_data[1]["id"],
                "label": "Next"
            }
        ]
        
        result = workflow_node_service.replace_workflow_nodes_and_connections(
            test_workflow.id, nodes_data, connections_data, test_organization.id
        )
        
        assert "nodes" in result
        assert "connections" in result
        assert len(result["nodes"]) == 2
        assert len(result["connections"]) == 1
    
    def test_replace_workflow_nodes_and_connections_workflow_not_found(self, workflow_node_service, test_organization):
        """Test replacing nodes with non-existent workflow"""
        non_existent_workflow_id = uuid4()
        
        with pytest.raises(ValueError, match="Workflow not found"):
            workflow_node_service.replace_workflow_nodes_and_connections(
                non_existent_workflow_id, [], [], test_organization.id
            )
    
    def test_replace_workflow_nodes_and_connections_wrong_organization(self, workflow_node_service, test_workflow):
        """Test replacing nodes with wrong organization"""
        wrong_org_id = uuid4()
        
        with pytest.raises(ValueError, match="Workflow does not belong to your organization"):
            workflow_node_service.replace_workflow_nodes_and_connections(
                test_workflow.id, [], [], wrong_org_id
            )
    
    def test_replace_workflow_nodes_with_sanitization(self, workflow_node_service, test_workflow, test_organization):
        """Test replacing workflow nodes with text that needs sanitization"""
        nodes_data = [
            {
                "id": str(uuid4()),  # Use proper UUID strings
                "node_type": "message",
                "name": "Test\udcacNode\udd16",  # Contains surrogate characters
                "message_text": "Hello\udcac World\udd16",
                "position_x": 100,
                "position_y": 100
            }
        ]
        
        result = workflow_node_service.replace_workflow_nodes_and_connections(
            test_workflow.id, nodes_data, [], test_organization.id
        )
        
        assert len(result["nodes"]) == 1
        created_node = result["nodes"][0]
        # Verify that surrogate characters were removed
        assert "\udcac" not in created_node.name
        assert "\udd16" not in created_node.name
        assert "\udcac" not in created_node.config.get("message_text", "")
        assert "\udd16" not in created_node.config.get("message_text", "")
    
    def test_replace_workflow_with_database_rollback(self, workflow_node_service, test_workflow, test_organization):
        """Test that database rollback works when error occurs during replacement"""
        # Mock the repository to raise an exception
        with patch.object(workflow_node_service.node_repo, 'create_node') as mock_create:
            mock_create.side_effect = Exception("Database error")
            
            nodes_data = [{"id": "node-1", "node_type": "message", "name": "Test"}]
            
            with pytest.raises(Exception):
                workflow_node_service.replace_workflow_nodes_and_connections(
                    test_workflow.id, nodes_data, [], test_organization.id
                )
    
    def test_update_single_node_with_sanitization(self, workflow_node_service, test_workflow_node, test_organization):
        """Test updating node with text that needs sanitization"""
        update_data = {
            "name": "Updated\udcac Node\udd16",
            "description": "Updated\udcac description\udd16"
        }
        
        result = workflow_node_service.update_single_node(
            test_workflow_node.workflow_id,
            test_workflow_node.id,
            update_data,
            test_organization.id
        )
        
        # Verify that surrogate characters were removed
        assert "\udcac" not in result.name
        assert "\udd16" not in result.name
        if result.description:
            assert "\udcac" not in result.description
            assert "\udd16" not in result.description
    
    def test_update_single_node_database_rollback(self, workflow_node_service, test_workflow_node, test_organization):
        """Test that database rollback works when error occurs during node update"""
        with patch.object(workflow_node_service.node_repo, 'update_node') as mock_update:
            mock_update.side_effect = Exception("Database error")
            
            with pytest.raises(Exception):
                workflow_node_service.update_single_node(
                    test_workflow_node.workflow_id,
                    test_workflow_node.id,
                    {"name": "New Name"},
                    test_organization.id
                ) 