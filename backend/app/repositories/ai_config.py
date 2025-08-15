"""
ChatterMate - Ai Config
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
from app.models.ai_config import AIConfig, AIModelType
from app.core.security import encrypt_api_key, decrypt_api_key
from typing import Optional


class AIConfigRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_config(self, org_id: str, model_type: str, model_name: str, api_key: str) -> AIConfig:
        """Create a new AI configuration"""
        try:
            # Encrypt API key before storing
            encrypted_key = encrypt_api_key(api_key)

            # Create new config
            config = AIConfig(
                organization_id=org_id,
                model_type=AIModelType(model_type.upper()),
                model_name=model_name,
                encrypted_api_key=encrypted_key,
                is_active=True
            )

            # Deactivate any existing configs
            existing_configs = self.db.query(AIConfig).filter(
                AIConfig.organization_id == org_id,
                AIConfig.is_active == True
            ).all()
            for existing in existing_configs:
                existing.is_active = False

            self.db.add(config)
            self.db.commit()
            self.db.refresh(config)
            return config

        except Exception as e:
            self.db.rollback()
            raise e

    def get_active_config(self, org_id: str) -> Optional[AIConfig]:
        """Get active AI configuration for an organization"""
        config = self.db.query(AIConfig).filter(
            AIConfig.organization_id == org_id,
            AIConfig.is_active == True
        ).first()

        if not config:
            return None

        # Return dict with decrypted API key
        return config

    def update_config(self, config_id: int, **kwargs) -> Optional[AIConfig]:
        """Update an existing AI configuration"""
        config = self.db.query(AIConfig).filter(
            AIConfig.id == config_id).first()
        if not config:
            return None

        for key, value in kwargs.items():
            if key == 'api_key':
                config.encrypted_api_key = encrypt_api_key(value)
            else:
                setattr(config, key, value)

        self.db.commit()
        self.db.refresh(config)
        return config

    def deactivate_config(self, config_id: int) -> bool:
        """Deactivate an AI configuration"""
        config = self.db.query(AIConfig).filter(
            AIConfig.id == config_id).first()
        if not config:
            return False

        config.is_active = False
        self.db.commit()
        return True
