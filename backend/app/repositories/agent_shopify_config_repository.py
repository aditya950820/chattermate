"""
ChatterMate - Agent Shopify Config Repository
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

import uuid
from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.shopify.agent_shopify_config import AgentShopifyConfig
from app.models.schemas.shopify.agent_shopify_config import (
    AgentShopifyConfigCreate,
    AgentShopifyConfigUpdate
)
from app.core.logger import get_logger
from sqlalchemy import cast, String

logger = get_logger(__name__)

class AgentShopifyConfigRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_agent_shopify_config(self, agent_id: str) -> Optional[AgentShopifyConfig]:
        """Get Shopify configuration for an agent."""
        return self.db.query(AgentShopifyConfig).filter(AgentShopifyConfig.agent_id == agent_id).first()
    
    def get_configs_by_shop(self, shop_id: str) -> List[AgentShopifyConfig]:
        """Get all agent configurations for a specific shop."""
        return self.db.query(AgentShopifyConfig).filter(AgentShopifyConfig.shop_id == shop_id).all()
    
    def get_enabled_configs_for_org(self, organization_id: str) -> List[AgentShopifyConfig]:
        """
        Get all enabled Shopify configurations for agents belonging to a specific organization.
        
        Args:
            organization_id: The ID of the organization to check
            
        Returns:
            List of AgentShopifyConfig objects that are enabled and belong to the organization
        """
        # We need to join with the User/Agent table to filter by organization_id
        from app.models.user import User
        
        return (self.db.query(AgentShopifyConfig)
                .join(User, User.id.cast(String) == AgentShopifyConfig.agent_id)
                .filter(
                    AgentShopifyConfig.enabled == True,
                    User.organization_id == organization_id
                )
                .all())
    
    def create_agent_shopify_config(self, config: AgentShopifyConfigCreate) -> AgentShopifyConfig:
        """Create a new Shopify configuration for an agent."""
        db_config = AgentShopifyConfig(
            id=str(uuid.uuid4()),
            agent_id=config.agent_id,
            shop_id=config.shop_id,
            enabled=config.enabled
        )
        self.db.add(db_config)
        self.db.commit()
        self.db.refresh(db_config)
        return db_config
    
    def update_agent_shopify_config(self, agent_id: str, config: AgentShopifyConfigUpdate) -> Optional[AgentShopifyConfig]:
        """Update an existing Shopify configuration for an agent."""
        db_config = self.get_agent_shopify_config(agent_id)
        if not db_config:
            return None
        
        for key, value in config.dict(exclude_unset=True).items():
            setattr(db_config, key, value)
        
        self.db.commit()
        self.db.refresh(db_config)
        return db_config
    
    def delete_agent_shopify_config(self, agent_id: str) -> bool:
        """Delete a Shopify configuration for an agent."""
        db_config = self.get_agent_shopify_config(agent_id)
        if not db_config:
            return False
        
        self.db.delete(db_config)
        self.db.commit()
        return True 