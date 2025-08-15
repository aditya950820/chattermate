"""
ChatterMate - Customer
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
from app.models.customer import Customer
from uuid import UUID
from app.core.logger import get_logger

logger = get_logger(__name__)

class CustomerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_customer_by_email(
        self,
        email: str,
        organization_id: UUID
    ) -> Customer | None:
        """Get existing customer by email and organization ID"""
        try:
            customer = self.db.query(Customer).filter(
                Customer.email == email,
                Customer.organization_id == organization_id
            ).first()
            return customer
        except Exception as e:
            logger.error(f"Error getting customer by email: {str(e)}")
            return None

    def create_customer(
        self,
        email: str,
        organization_id: UUID,
        full_name: str = None
    ) -> Customer:
        """Create a new customer"""
        try:
            customer = Customer(
                email=email,
                full_name=full_name,
                organization_id=organization_id
            )
            self.db.add(customer)
            self.db.commit()
            self.db.refresh(customer)
            return customer
        except Exception as e:
            logger.error(f"Error creating customer: {str(e)}")
            self.db.rollback()
            raise

    def get_or_create_customer(
        self,
        email: str,
        organization_id: UUID,
        full_name: str = None
    ) -> Customer:
        """Get existing customer or create new one"""
        customer = self.get_customer_by_email(email, organization_id)

        if not customer:
            customer = self.create_customer(email, organization_id, full_name)
        else:
            logger.info(f"Customer already exists: {customer.id}")

        return customer

    def get_by_id(self, customer_id: UUID) -> Customer | None:
        """Get customer by ID"""
        try:
            customer = self.db.query(Customer).filter(Customer.id == customer_id).first()
            return customer
        except Exception as e:
            logger.error(f"Error getting customer by ID: {str(e)}")
            return None

    def get_customer_email(self, customer_id: UUID) -> str | None:
        """Get customer email by ID"""
        try:
            customer = self.get_by_id(customer_id)
            return customer.email if customer else None
        except Exception as e:
            logger.error(f"Error getting customer email: {str(e)}")
            return None
