"""
ChatterMate - Test Shopify API Routes
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
from unittest.mock import MagicMock, patch, ANY
from fastapi import HTTPException
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import uuid
import json
import hmac
import hashlib
import base64
from urllib.parse import urlencode, quote
from datetime import datetime, timezone
from app.models.schemas.shopify.agent_shopify_config import AgentShopifyConfig
from app.models.shopify.agent_shopify_config import AgentShopifyConfig

from app.main import app
from app.api.shopify import router, validate_shop_request, verify_shopify_webhook
from app.repositories.shopify_shop_repository import ShopifyShopRepository
from app.repositories.agent_shopify_config_repository import AgentShopifyConfigRepository
from app.models.shopify import ShopifyShop
from app.models.schemas.shopify import ShopifyShopCreate, ShopifyShopUpdate
from app.models.schemas.shopify import AgentShopifyConfigBase, AgentShopifyConfigCreate, AgentShopifyConfigUpdate
from app.services.shopify import ShopifyService


@pytest.fixture
def mock_db():
    """Create a mock database session"""
    db = MagicMock(spec=Session)
    return db


@pytest.fixture
def sample_shop_data():
    """Sample shop data for testing"""
    return {
        "id": str(uuid.uuid4()),
        "shop_domain": "test-shop.myshopify.com",
        "access_token": "test_access_token",
        "scope": "read_products,write_products",
        "is_installed": True,
        "organization_id": str(uuid.uuid4()),
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }


@pytest.fixture
def mock_shop(sample_shop_data):
    """Create a mock ShopifyShop instance"""
    shop = MagicMock(spec=ShopifyShop)
    for key, value in sample_shop_data.items():
        setattr(shop, key, value)
    return shop


@pytest.fixture
def mock_organization():
    """Create a mock Organization instance"""
    org = MagicMock()
    org.id = uuid.uuid4()
    return org


@pytest.fixture
def mock_user():
    """Create a mock User instance"""
    user = MagicMock()
    user.id = uuid.uuid4()
    return user


@pytest.fixture
def api_client():
    """Create a TestClient for the FastAPI app"""
    return TestClient(app)


def test_verify_shopify_webhook():
    """Test the verify_shopify_webhook function"""
    # Arrange
    request_body = b'{"test":"data"}'
    secret = "test_secret"
    
    with patch('app.api.shopify.settings') as mock_settings:
        mock_settings.SHOPIFY_API_SECRET = secret
        
        # Create a valid HMAC
        digest = hmac.new(
            secret.encode('utf-8'),
            request_body,
            hashlib.sha256
        ).digest()
        valid_hmac = base64.b64encode(digest).decode('utf-8')
        
        # Act & Assert - Valid HMAC
        headers = {"X-Shopify-Hmac-Sha256": valid_hmac}
        assert verify_shopify_webhook(headers, request_body) is True
        
        # Act & Assert - Invalid HMAC
        headers = {"X-Shopify-Hmac-Sha256": "invalid_hmac"}
        assert verify_shopify_webhook(headers, request_body) is False
        
        # Act & Assert - Missing HMAC
        headers = {}
        assert verify_shopify_webhook(headers, request_body) is False


def test_validate_shop_request():
    """Test the validate_shop_request function"""
    # Arrange
    shop = "test-shop.myshopify.com"
    secret = "test_secret"
    
    # Create a valid request with HMAC
    query_params = {
        "shop": shop,
        "timestamp": "1234567890",
        "code": "test_code"
    }
    
    # Sort and encode parameters for HMAC calculation
    sorted_params = "&".join([f"{key}={quote(value)}" for key, value in sorted(query_params.items())])
    
    # Generate HMAC
    digest = hmac.new(
        secret.encode('utf-8'),
        sorted_params.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    # Create request object
    mock_request = MagicMock()
    # Add hmac to query params
    query_params_with_hmac = query_params.copy()
    query_params_with_hmac["hmac"] = digest
    mock_request.query_params = query_params_with_hmac
    
    with patch('app.api.shopify.settings') as mock_settings:
        mock_settings.SHOPIFY_API_SECRET = secret
        
        # Act & Assert - Valid shop and HMAC
        assert validate_shop_request(mock_request, shop, digest) is True
        
        # Act & Assert - Invalid shop domain
        assert validate_shop_request(mock_request, "not-shopify.com", digest) is False
        
        # Act & Assert - Invalid HMAC
        assert validate_shop_request(mock_request, shop, "invalid_hmac") is False


@pytest.mark.asyncio
@patch('app.api.shopify.validate_shop_request')
@patch('app.api.shopify.ShopifyShopRepository')
@patch('app.api.shopify.ShopifyService')
async def test_shopify_auth_new_shop(mock_shopify_service, mock_shop_repo, mock_validate, mock_db, mock_user):
    """Test the shopify_auth endpoint for a new shop"""
    # Arrange
    shop = "test-shop.myshopify.com"
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    mock_shop_repo_instance.get_shop_by_domain.return_value = None  # Shop not found
    
    mock_request = MagicMock()
    mock_validate.return_value = True
    
    with patch('app.api.shopify.settings') as mock_settings:
        mock_settings.SHOPIFY_API_KEY = "test_api_key"
        mock_settings.FRONTEND_URL = "https://example.com"
        mock_settings.SCOPES = "read_products,write_products"
        
        # Act
        from app.api.shopify import shopify_auth
        response = await shopify_auth(mock_request, shop, "test_hmac", mock_db, mock_user)
        
        # Assert
        assert response.status_code == 307  # Update expected status code to 307 for RedirectResponse


@pytest.mark.asyncio
@patch('app.api.shopify.validate_shop_request')
@patch('app.api.shopify.requests.post')
@patch('app.api.shopify.ShopifyShopRepository')
async def test_shopify_callback(mock_shop_repo, mock_post, mock_validate, mock_db, mock_organization):
    """Test the shopify_callback endpoint"""
    # Arrange
    shop = "test-shop.myshopify.com"
    code = "test_code"
    hmac_param = "test_hmac"
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    mock_shop_repo_instance.get_shop_by_domain.return_value = None  # Shop not found
    
    mock_validate.return_value = True  # Request validation passes
    
    # Mock the token exchange response
    mock_post.return_value.json.return_value = {
        "access_token": "new_access_token",
        "scope": "read_products,write_products"
    }
    mock_post.return_value.status_code = 200
    mock_post.return_value.raise_for_status = MagicMock()
    
    mock_request = MagicMock()
    
    with patch('app.api.shopify.settings') as mock_settings:
        mock_settings.SHOPIFY_API_KEY = "test_api_key"
        mock_settings.SHOPIFY_API_SECRET = "test_secret"
        
        # Act
        from app.api.shopify import shopify_callback
        response = await shopify_callback(mock_request, shop, code, None, hmac_param, mock_db, mock_organization)
        
        # Assert
        # Should create a new shop
        mock_shop_repo_instance.create_shop.assert_called_once()
        # Should redirect to the shop admin
        assert response.status_code == 307  # Update expected status code to 307 for RedirectResponse


@pytest.mark.asyncio
@patch('app.api.shopify.ShopifyShopRepository')
async def test_get_shops(mock_shop_repo, mock_db, mock_organization, mock_user):
    """Test the get_shops endpoint"""
    # Arrange
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    # Create some mock shops
    shop1 = MagicMock(spec=ShopifyShop)
    shop1.id = str(uuid.uuid4())
    shop1.shop_domain = "shop1.myshopify.com"
    
    shop2 = MagicMock(spec=ShopifyShop)
    shop2.id = str(uuid.uuid4())
    shop2.shop_domain = "shop2.myshopify.com"
    
    mock_shop_repo_instance.get_shops_by_organization.return_value = [shop1, shop2]
    
    # Act
    from app.api.shopify import get_shops
    response = await get_shops(mock_db, 0, 100, mock_organization, mock_user)
    
    # Assert
    mock_shop_repo_instance.get_shops_by_organization.assert_called_once()
    assert len(response) == 2
    assert response[0] == shop1
    assert response[1] == shop2


@pytest.mark.asyncio
@patch('app.api.shopify.ShopifyShopRepository')
async def test_get_shop(mock_shop_repo, mock_db, mock_organization, mock_user, sample_shop_data):
    """Test the get_shop endpoint"""
    # Arrange
    shop_id = sample_shop_data["id"]
    org_id = str(mock_organization.id)
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    # Create a mock shop with the same organization ID
    mock_shop = MagicMock(spec=ShopifyShop)
    for key, value in sample_shop_data.items():
        setattr(mock_shop, key, value)
    mock_shop.organization_id = org_id
    
    mock_shop_repo_instance.get_shop.return_value = mock_shop
    
    # Act
    from app.api.shopify import get_shop
    response = await get_shop(shop_id, mock_db, mock_organization, mock_user)
    
    # Assert
    mock_shop_repo_instance.get_shop.assert_called_once_with(shop_id)
    assert response == mock_shop


@pytest.mark.asyncio
@patch('app.api.shopify.ShopifyShopRepository')
async def test_get_shop_not_found(mock_shop_repo, mock_db, mock_organization, mock_user):
    """Test the get_shop endpoint when shop is not found"""
    # Arrange
    shop_id = str(uuid.uuid4())
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    mock_shop_repo_instance.get_shop.return_value = None  # Shop not found
    
    # Act & Assert
    from app.api.shopify import get_shop
    with pytest.raises(HTTPException) as exc_info:
        await get_shop(shop_id, mock_db, mock_organization, mock_user)
    
    assert exc_info.value.status_code == 404
    assert "not found" in str(exc_info.value.detail).lower()


@pytest.mark.asyncio
@patch('app.api.shopify.ShopifyShopRepository')
async def test_get_shop_wrong_organization(mock_shop_repo, mock_db, mock_organization, mock_user, sample_shop_data):
    """Test the get_shop endpoint when shop belongs to a different organization"""
    # Arrange
    shop_id = sample_shop_data["id"]
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    # Create a mock shop with a different organization ID
    mock_shop = MagicMock(spec=ShopifyShop)
    for key, value in sample_shop_data.items():
        setattr(mock_shop, key, value)
    mock_shop.organization_id = str(uuid.uuid4())  # Different organization ID
    
    mock_shop_repo_instance.get_shop.return_value = mock_shop
    
    # Act & Assert
    from app.api.shopify import get_shop
    with pytest.raises(HTTPException) as exc_info:
        await get_shop(shop_id, mock_db, mock_organization, mock_user)
    
    assert exc_info.value.status_code == 403
    assert "does not belong to your organization" in str(exc_info.value.detail).lower()


@pytest.mark.asyncio
@patch('app.api.shopify.AgentShopifyConfigRepository')
@patch('app.api.shopify.ShopifyShopRepository')
async def test_delete_shop(mock_shop_repo, mock_config_repo, mock_db, mock_organization, mock_user, sample_shop_data):
    """Test the delete_shop endpoint"""
    # Arrange
    shop_id = sample_shop_data["id"]
    org_id = str(mock_organization.id)
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    mock_config_repo_instance = MagicMock()
    mock_config_repo.return_value = mock_config_repo_instance
    
    # Create a mock shop with the same organization ID
    mock_shop = MagicMock(spec=ShopifyShop)
    for key, value in sample_shop_data.items():
        setattr(mock_shop, key, value)
    mock_shop.organization_id = org_id
    
    mock_shop_repo_instance.get_shop.return_value = mock_shop
    mock_shop_repo_instance.delete_shop.return_value = True
    
    # Mock some agent configs
    agent_config1 = MagicMock()
    agent_config1.agent_id = str(uuid.uuid4())
    
    agent_config2 = MagicMock()
    agent_config2.agent_id = str(uuid.uuid4())
    
    mock_config_repo_instance.get_configs_by_shop.return_value = [agent_config1, agent_config2]
    
    with patch('app.api.shopify.requests.post') as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.text = "ok"
        
        # Act
        from app.api.shopify import delete_shop
        response = await delete_shop(shop_id, mock_db, mock_organization, mock_user)
        
        # Assert
        mock_shop_repo_instance.get_shop.assert_called_once_with(shop_id)
        mock_config_repo_instance.get_configs_by_shop.assert_called_once_with(shop_id)
        # Should update each agent config to disable Shopify
        assert mock_config_repo_instance.update_agent_shopify_config.call_count == 2
        # Should delete the shop
        mock_shop_repo_instance.delete_shop.assert_called_once_with(shop_id)
        
        assert response["status"] == "success"
        assert "disconnected" in response["message"].lower()


@pytest.mark.asyncio
@patch('app.api.shopify.ShopifyShopRepository')
async def test_check_connection_connected(mock_shop_repo, mock_db, mock_organization, mock_user):
    """Test the check_connection endpoint when connected"""
    # Arrange
    org_id = str(mock_organization.id)
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    # Create a mock shop that is installed
    mock_shop = MagicMock(spec=ShopifyShop)
    mock_shop.id = str(uuid.uuid4())
    mock_shop.shop_domain = "test-shop.myshopify.com"
    mock_shop.is_installed = True
    
    mock_shop_repo_instance.get_shops_by_organization.return_value = [mock_shop]
    
    # Act
    from app.api.shopify import check_connection
    response = await check_connection(mock_db, mock_organization, mock_user)
    
    # Assert
    mock_shop_repo_instance.get_shops_by_organization.assert_called_once()
    assert response["connected"] is True
    assert response["shop_domain"] == mock_shop.shop_domain


@pytest.mark.asyncio
@patch('app.api.shopify.ShopifyShopRepository')
async def test_check_connection_not_connected(mock_shop_repo, mock_db, mock_organization, mock_user):
    """Test the check_connection endpoint when not connected"""
    # Arrange
    org_id = str(mock_organization.id)
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    # No shops returned
    mock_shop_repo_instance.get_shops_by_organization.return_value = []
    
    # Act
    from app.api.shopify import check_connection
    response = await check_connection(mock_db, mock_organization, mock_user)
    
    # Assert
    mock_shop_repo_instance.get_shops_by_organization.assert_called_once()
    assert response["connected"] is False
    assert "shop_domain" not in response


@pytest.mark.asyncio
@patch('app.api.shopify.AgentShopifyConfigRepository')
async def test_get_agent_shopify_config(mock_config_repo, mock_db, mock_user):
    """Test the get_agent_shopify_config endpoint"""
    # Arrange
    agent_id = str(uuid.uuid4())
    
    mock_config_repo_instance = MagicMock()
    mock_config_repo.return_value = mock_config_repo_instance
    
    # Create a mock config
    mock_config = MagicMock(spec=AgentShopifyConfig)
    mock_config.agent_id = agent_id
    mock_config.enabled = True
    mock_config.shop_id = str(uuid.uuid4())
    
    mock_config_repo_instance.get_agent_shopify_config.return_value = mock_config
    
    # Act
    from app.api.shopify import get_agent_shopify_config
    response = await get_agent_shopify_config(agent_id, mock_db, mock_user)
    
    # Assert
    mock_config_repo_instance.get_agent_shopify_config.assert_called_once_with(agent_id)
    assert response == mock_config


@pytest.mark.asyncio
@patch('app.api.shopify.AgentShopifyConfigRepository')
async def test_get_agent_shopify_config_not_found(mock_config_repo, mock_db, mock_user):
    """Test the get_agent_shopify_config endpoint when config is not found"""
    # Arrange
    agent_id = str(uuid.uuid4())
    
    mock_config_repo_instance = MagicMock()
    mock_config_repo.return_value = mock_config_repo_instance
    
    # No config found
    mock_config_repo_instance.get_agent_shopify_config.return_value = None
    
    # Act & Assert
    from app.api.shopify import get_agent_shopify_config
    with pytest.raises(HTTPException) as exc_info:
        await get_agent_shopify_config(agent_id, mock_db, mock_user)
    
    assert exc_info.value.status_code == 404
    assert "not found" in str(exc_info.value.detail).lower()


@pytest.mark.asyncio
@patch('app.api.shopify.KnowledgeRepository')
@patch('app.api.shopify.ShopifyShopRepository')
@patch('app.api.shopify.AgentShopifyConfigRepository')
async def test_save_agent_shopify_config_create(mock_config_repo, mock_shop_repo, mock_knowledge_repo, 
                                               mock_db, mock_organization, mock_user):
    """Test the save_agent_shopify_config endpoint - creating new config"""
    # Arrange
    agent_id = str(uuid.uuid4())
    shop_id = str(uuid.uuid4())
    org_id = str(mock_organization.id)
    
    # Create config input
    config_input = AgentShopifyConfigBase(enabled=True)
    
    mock_config_repo_instance = MagicMock()
    mock_config_repo.return_value = mock_config_repo_instance
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    mock_knowledge_repo_instance = MagicMock()
    mock_knowledge_repo.return_value = mock_knowledge_repo_instance
    
    # No existing config
    mock_config_repo_instance.get_agent_shopify_config.return_value = None
    
    # Create a mock shop
    mock_shop = MagicMock(spec=ShopifyShop)
    mock_shop.id = shop_id
    mock_shop.shop_domain = "test-shop.myshopify.com"
    mock_shop.is_installed = True
    
    # Return the mock shop for the organization
    mock_shop_repo_instance.get_shops_by_organization.return_value = [mock_shop]
    
    # No existing knowledge source
    mock_knowledge_repo_instance.get_by_sources.return_value = []
    
    # Mock knowledge queue and link repositories
    with patch('app.api.shopify.KnowledgeQueueRepository') as mock_queue_repo, \
         patch('app.api.shopify.KnowledgeToAgentRepository') as mock_link_repo:
        
        mock_queue_repo_instance = MagicMock()
        mock_queue_repo.return_value = mock_queue_repo_instance
        
        mock_link_repo_instance = MagicMock()
        mock_link_repo.return_value = mock_link_repo_instance
        
        # Mock the create methods
        mock_config_repo_instance.create_agent_shopify_config.return_value = MagicMock(
            agent_id=agent_id, enabled=True, shop_id=shop_id
        )
        
        # Act
        from app.api.shopify import save_agent_shopify_config
        response = await save_agent_shopify_config(agent_id, config_input, mock_organization, mock_user, mock_db)
        
        # Assert
        # Should check for existing config
        mock_config_repo_instance.get_agent_shopify_config.assert_called_once_with(agent_id)
        # Should get shops for the organization
        mock_shop_repo_instance.get_shops_by_organization.assert_called_once()
        # Should create a new config with the right parameters
        mock_config_repo_instance.create_agent_shopify_config.assert_called_once()
        # Should check for existing knowledge
        mock_knowledge_repo_instance.get_by_sources.assert_called_once()
        # Should queue knowledge indexing
        mock_queue_repo_instance.create.assert_called_once()
        
        assert response.agent_id == agent_id
        assert response.enabled is True
        assert response.shop_id == shop_id 


@pytest.mark.asyncio
@patch('app.api.shopify.KnowledgeRepository')
@patch('app.api.shopify.ShopifyShopRepository')
@patch('app.api.shopify.AgentShopifyConfigRepository')
async def test_save_agent_shopify_config_knowledge_error(mock_config_repo, mock_shop_repo, mock_knowledge_repo, 
                                               mock_db, mock_organization, mock_user):
    """Test the save_agent_shopify_config endpoint when an error occurs during knowledge linking"""
    # Arrange
    agent_id = str(uuid.uuid4())
    shop_id = str(uuid.uuid4())
    org_id = str(mock_organization.id)
    
    # Create config input
    config_input = AgentShopifyConfigBase(enabled=True)
    
    mock_config_repo_instance = MagicMock()
    mock_config_repo.return_value = mock_config_repo_instance
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    mock_knowledge_repo_instance = MagicMock()
    mock_knowledge_repo.return_value = mock_knowledge_repo_instance
    
    # No existing config
    mock_config_repo_instance.get_agent_shopify_config.return_value = None
    
    # Create a mock shop
    mock_shop = MagicMock(spec=ShopifyShop)
    mock_shop.id = shop_id
    mock_shop.shop_domain = "test-shop.myshopify.com"
    mock_shop.is_installed = True
    
    # Return the mock shop for the organization
    mock_shop_repo_instance.get_shops_by_organization.return_value = [mock_shop]
    
    # Mock knowledge process to raise an exception
    mock_knowledge_repo_instance.get_by_sources.side_effect = Exception("Mock knowledge error")
    
    # Mock the create methods
    mock_config_repo_instance.create_agent_shopify_config.return_value = MagicMock(
        agent_id=agent_id, enabled=True, shop_id=shop_id
    )
    
    # Act
    from app.api.shopify import save_agent_shopify_config
    response = await save_agent_shopify_config(agent_id, config_input, mock_organization, mock_user, mock_db)
    
    # Assert
    # Should check for existing config
    mock_config_repo_instance.get_agent_shopify_config.assert_called_once_with(agent_id)
    # Should get shops for the organization
    mock_shop_repo_instance.get_shops_by_organization.assert_called_once()
    # Should create a new config with the right parameters
    mock_config_repo_instance.create_agent_shopify_config.assert_called_once()
    # Should check for existing knowledge
    mock_knowledge_repo_instance.get_by_sources.assert_called_once()
    
    # Config should still be saved despite knowledge error
    assert response.agent_id == agent_id
    assert response.enabled is True
    assert response.shop_id == shop_id


@pytest.mark.asyncio
@patch('app.api.shopify.AgentShopifyConfigRepository')
@patch('app.api.shopify.ShopifyShopRepository')
async def test_save_agent_shopify_config_no_shops(mock_shop_repo, mock_config_repo, 
                                            mock_db, mock_organization, mock_user):
    """Test the save_agent_shopify_config endpoint when no shops are installed"""
    # Arrange
    agent_id = str(uuid.uuid4())
    
    # Create config input attempting to enable with no shops
    config_input = AgentShopifyConfigBase(enabled=True)
    
    mock_config_repo_instance = MagicMock()
    mock_config_repo.return_value = mock_config_repo_instance
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    # No existing config
    mock_config_repo_instance.get_agent_shopify_config.return_value = None
    
    # No shops returned
    mock_shop_repo_instance.get_shops_by_organization.return_value = []
    
    # Act & Assert
    from app.api.shopify import save_agent_shopify_config
    with pytest.raises(HTTPException) as exc_info:
        await save_agent_shopify_config(agent_id, config_input, mock_organization, mock_user, mock_db)
    
    assert exc_info.value.status_code == 400
    assert "no installed shopify shops found" in str(exc_info.value.detail).lower()
    
    # Should check for existing config
    mock_config_repo_instance.get_agent_shopify_config.assert_called_once_with(agent_id)
    # Should get shops for the organization
    mock_shop_repo_instance.get_shops_by_organization.assert_called_once()
    # Should NOT attempt to create a config
    mock_config_repo_instance.create_agent_shopify_config.assert_not_called() 


@pytest.mark.asyncio
@patch('app.api.shopify.KnowledgeRepository')
@patch('app.api.shopify.ShopifyShopRepository')
@patch('app.api.shopify.AgentShopifyConfigRepository')
async def test_save_agent_shopify_config_update(mock_config_repo, mock_shop_repo, mock_knowledge_repo, 
                                              mock_db, mock_organization, mock_user):
    """Test the save_agent_shopify_config endpoint - updating existing config"""
    # Arrange
    agent_id = str(uuid.uuid4())
    shop_id = str(uuid.uuid4())
    org_id = str(mock_organization.id)
    
    # Create config input
    config_input = AgentShopifyConfigBase(enabled=True)
    
    mock_config_repo_instance = MagicMock()
    mock_config_repo.return_value = mock_config_repo_instance
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    mock_knowledge_repo_instance = MagicMock()
    mock_knowledge_repo.return_value = mock_knowledge_repo_instance
    
    # Create existing config
    existing_config = MagicMock()
    existing_config.agent_id = agent_id
    existing_config.enabled = False
    existing_config.shop_id = None
    
    # Return existing config
    mock_config_repo_instance.get_agent_shopify_config.return_value = existing_config
    
    # Create a mock shop
    mock_shop = MagicMock(spec=ShopifyShop)
    mock_shop.id = shop_id
    mock_shop.shop_domain = "test-shop.myshopify.com"
    mock_shop.is_installed = True
    
    # Return the mock shop for the organization
    mock_shop_repo_instance.get_shops_by_organization.return_value = [mock_shop]
    
    # Should return existing knowledge
    existing_knowledge = MagicMock()
    existing_knowledge.id = str(uuid.uuid4())
    mock_knowledge_repo_instance.get_by_sources.return_value = [existing_knowledge]
    
    # Mock update result
    updated_config = MagicMock()
    updated_config.agent_id = agent_id
    updated_config.enabled = True
    updated_config.shop_id = shop_id
    mock_config_repo_instance.update_agent_shopify_config.return_value = updated_config
    
    # Mock knowledge to agent repository and its methods
    with patch('app.api.shopify.KnowledgeToAgentRepository') as mock_link_repo:
        mock_link_repo_instance = MagicMock()
        mock_link_repo.return_value = mock_link_repo_instance
        
        # No existing link
        mock_link_repo_instance.get_by_ids.return_value = None
        
        # Act
        from app.api.shopify import save_agent_shopify_config
        response = await save_agent_shopify_config(agent_id, config_input, mock_organization, mock_user, mock_db)
        
        # Assert
        # Should check for existing config
        mock_config_repo_instance.get_agent_shopify_config.assert_called_once_with(agent_id)
        # Should get shops for the organization
        mock_shop_repo_instance.get_shops_by_organization.assert_called_once()
        # Should update existing config
        mock_config_repo_instance.update_agent_shopify_config.assert_called_once()
        # Should NOT attempt to create a new config
        mock_config_repo_instance.create_agent_shopify_config.assert_not_called()
        # Should check for existing knowledge
        mock_knowledge_repo_instance.get_by_sources.assert_called_once()
        # Should check for and create knowledge link
        mock_link_repo_instance.get_by_ids.assert_called_once()
        mock_link_repo_instance.create.assert_called_once()
        
        assert response.agent_id == agent_id
        assert response.enabled is True
        assert response.shop_id == shop_id 


@pytest.mark.asyncio
@patch('app.api.shopify.AgentShopifyConfigRepository')
@patch('app.api.shopify.ShopifyShopRepository')
async def test_save_agent_shopify_config_disable(mock_shop_repo, mock_config_repo, 
                                              mock_db, mock_organization, mock_user):
    """Test the save_agent_shopify_config endpoint - disabling existing config"""
    # Arrange
    agent_id = str(uuid.uuid4())
    shop_id = str(uuid.uuid4())
    
    # Create config input with disabled=False
    config_input = AgentShopifyConfigBase(enabled=False)
    
    mock_config_repo_instance = MagicMock()
    mock_config_repo.return_value = mock_config_repo_instance
    
    mock_shop_repo_instance = MagicMock()
    mock_shop_repo.return_value = mock_shop_repo_instance
    
    # Create existing config that is currently enabled
    existing_config = MagicMock()
    existing_config.agent_id = agent_id
    existing_config.enabled = True
    existing_config.shop_id = shop_id
    
    # Return existing config
    mock_config_repo_instance.get_agent_shopify_config.return_value = existing_config
    
    # Create a mock shop
    mock_shop = MagicMock(spec=ShopifyShop)
    mock_shop.id = shop_id
    mock_shop.shop_domain = "test-shop.myshopify.com"
    mock_shop.is_installed = True
    
    # Return the mock shop for the organization
    mock_shop_repo_instance.get_shops_by_organization.return_value = [mock_shop]
    
    # Mock update result
    updated_config = MagicMock()
    updated_config.agent_id = agent_id
    updated_config.enabled = False
    updated_config.shop_id = None  # Should be None when disabled
    mock_config_repo_instance.update_agent_shopify_config.return_value = updated_config
    
    # Act
    from app.api.shopify import save_agent_shopify_config
    response = await save_agent_shopify_config(agent_id, config_input, mock_organization, mock_user, mock_db)
    
    # Assert
    # Should check for existing config
    mock_config_repo_instance.get_agent_shopify_config.assert_called_once_with(agent_id)
    # Should get shops for the organization
    mock_shop_repo_instance.get_shops_by_organization.assert_called_once()
    # Should update existing config
    mock_config_repo_instance.update_agent_shopify_config.assert_called_once_with(
        agent_id, 
        AgentShopifyConfigUpdate(enabled=False, shop_id=None)
    )
    # Should NOT attempt to create a new config
    mock_config_repo_instance.create_agent_shopify_config.assert_not_called()
    
    assert response.agent_id == agent_id
    assert response.enabled is False
    assert response.shop_id is None 