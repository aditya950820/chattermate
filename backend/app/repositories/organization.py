"""
ChatterMate - Organization
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
from typing import Optional, List
from app.models.organization import Organization
from app.core.logger import get_logger

logger = get_logger(__name__)
from uuid import UUID

class OrganizationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_organization(
        self,
        name: str,
        domain: str,
        timezone: str = 'UTC',
        business_hours: Optional[dict] = None
    ) -> Organization:
        """Create a new organization"""
        try:
            organization = Organization(
                name=name,
                domain=domain,
                timezone=timezone,
                business_hours=business_hours
            )
            self.db.add(organization)
            self.db.flush()  # Get organization.id
            return organization

        except Exception as e:
            logger.error(f"Failed to create organization: {str(e)}")
            self.db.rollback()
            raise

    def get_organization(self, org_id: UUID) -> Optional[Organization]:
        """Get organization by ID"""
        return self.db.query(Organization).filter(
            Organization.id == org_id
        ).first()

    def get_organization_by_domain(self, domain: str) -> Optional[Organization]:
        """Get organization by domain"""
        return self.db.query(Organization).filter(
            Organization.domain == domain
        ).first()

    def get_active_organizations(self) -> List[Organization]:
        """Get all active organizations"""
        return self.db.query(Organization).filter(
            Organization.is_active == True
        ).all()

    def update_organization(
        self,
        org_id: UUID,
        name: Optional[str] = None,
        domain: Optional[str] = None,
        settings: Optional[dict] = None,
        is_active: Optional[bool] = None
    ) -> Optional[Organization]:
        """Update an organization"""
        try:
            organization = self.get_organization(org_id)
            if not organization:
                return None

            if name is not None:
                organization.name = name
            if domain is not None:
                organization.domain = domain
            if settings is not None:
                # Merge new settings with existing
                current_settings = organization.settings or {}
                current_settings.update(settings)
                organization.settings = current_settings
            if is_active is not None:
                organization.is_active = is_active

            self.db.commit()
            self.db.refresh(organization)
            return organization

        except Exception as e:
            logger.error(f"Failed to update organization {org_id}: {str(e)}")
            self.db.rollback()
            raise

    def update_settings(self, org_id: UUID, settings: dict) -> Optional[Organization]:
        """Update organization settings"""
        try:
            organization = self.get_organization(org_id)
            if not organization:
                return None

            # Merge new settings with existing
            current_settings = organization.settings or {}
            current_settings.update(settings)
            organization.settings = current_settings

            self.db.commit()
            self.db.refresh(organization)
            return organization

        except Exception as e:
            logger.error(f"Failed to update settings for org {
                         org_id}: {str(e)}")
            self.db.rollback()
            raise

    def deactivate_organization(self, org_id: UUID) -> bool:
        """Deactivate an organization"""
        try:
            organization = self.get_organization(org_id)
            if not organization:
                return False

            organization.is_active = False
            self.db.commit()
            return True

        except Exception as e:
            logger.error(f"Failed to deactivate org {org_id}: {str(e)}")
            self.db.rollback()
            raise

    def delete_organization(self, org_id: UUID) -> bool:
        """Hard delete an organization (use with caution)"""
        try:
            organization = self.get_organization(org_id)
            if not organization:
                return False

            self.db.delete(organization)
            self.db.commit()
            return True

        except Exception as e:
            logger.error(f"Failed to delete org {org_id}: {str(e)}")
            self.db.rollback()
            raise
