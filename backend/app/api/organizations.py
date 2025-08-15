"""
ChatterMate - Organizations
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

from typing import List
from urllib.parse import quote
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import json

from app.database import get_db
from app.models.organization import Organization
from app.models.user import User
from app.models.schemas.organization import (
    OrganizationCreate,
    OrganizationUpdate,
    OrganizationResponse,
    OrganizationCreateResponse
)
from app.core.auth import get_current_user, require_permissions
from app.core.security import create_access_token, create_refresh_token
from app.core.logger import get_logger
from app.models.role import Role
from app.models.permission import Permission
from app.repositories.organization import OrganizationRepository
from app.repositories.agent import AgentRepository
from app.core.default_templates import DEFAULT_TEMPLATES
from app.models.agent import AgentType
from uuid import UUID
from app.core.cors import update_cors_middleware
from app.core.application import app  # Import the FastAPI app instance from the new location

logger = get_logger(__name__)
router = APIRouter(
    tags=["organizations"]
)


@router.post("", response_model=OrganizationCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org_data: OrganizationCreate,
    response: Response,
    db: Session = Depends(get_db),
):
    """Create a new organization with an admin user and default roles"""
    try:
        # Check if any organization exists
        existing_orgs = db.query(Organization).first()
        
        # If organizations exist, return 403 Forbidden
        if existing_orgs:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Organization already exists"
            )

        
      
        # Create organization
        org_repo = OrganizationRepository(db)
        organization = org_repo.create_organization(
            name=org_data.name,
            domain=org_data.domain,
            timezone=org_data.timezone,
            business_hours=org_data.business_hours
        )

        # Create only the default Customer Support agent and make it active
        template_repo = AgentRepository(db)

        try:
            default_template = DEFAULT_TEMPLATES[AgentType.CUSTOMER_SUPPORT]
            template_repo.create_agent(
                name=default_template["name"],
                description=default_template["description"],
                agent_type=AgentType.CUSTOMER_SUPPORT,
                instructions=default_template["instructions"],
                tools=default_template["tools"],
                org_id=organization.id,
                is_default=True,
                is_active=True  # Make the default agent active
            )
            logger.info(f"Created default active Customer Support agent for org {organization.id}")
        except Exception as template_error:
            logger.error(f"Failed to create default agent for org {
                         organization.id}: {str(template_error)}")
            db.rollback()  # Rollback transaction on error
            raise HTTPException(
                status_code=500,
                detail=f"Failed to create default agent: {str(template_error)}"
            )

        # Get or create default permissions
        permissions = {}
        for name, description in Permission.default_permissions():
            # Try to get existing permission
            perm = db.query(Permission).filter(Permission.name == name).first()
            if not perm:
                perm = Permission(name=name, description=description)
                db.add(perm)
                db.flush()
            permissions[name] = perm

        # Create default roles
        admin_role = Role(
            name="Admin",
            description="Full access to all features",
            organization_id=organization.id,
            is_default=True
        )
        admin_role.permissions = list(permissions.values())  # All permissions
        db.add(admin_role)

        agent_role = Role(
            name="Agent",
            description="Access to assigned chats",
            organization_id=organization.id,
            is_default=True
        )
        agent_role.permissions = [
            permissions["view_assigned_chats"],
            permissions["manage_assigned_chats"]
        ]
        db.add(agent_role)
        db.flush()

        # Create admin user with admin role
        admin = User(
            email=org_data.admin_email,
            full_name=org_data.admin_name,
            hashed_password=User.get_password_hash(org_data.admin_password),
            organization_id=organization.id,
            role_id=admin_role.id,
            is_active=True
        )
        db.add(admin)
        db.flush()

        # Generate tokens and set cookies
        token_data = {"sub": str(admin.id), "org": str(organization.id)}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        # Set cookies and return response
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=1800  # 30 minutes
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=604800  # 7 days
        )

        # Set session data with role information
        response.set_cookie(
            key="user_info",
            value=quote(json.dumps({
                "id": str(admin.id),
                "email": admin.email,
                "full_name": admin.full_name,
                "organization_id": str(organization.id),
                "role": admin_role.to_dict()
            }, default=str)),
            samesite="lax",
            max_age=604800  # 7 days
        )

        db.commit()

        # Update CORS origins after creating organization
        update_cors_middleware(app)

        return {
            "id": organization.id,
            "name": organization.name,
            "domain": organization.domain,
            "timezone": organization.timezone,
            "business_hours": organization.business_hours,
            "settings": organization.settings,
            "is_active": organization.is_active,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": admin.id,
                "email": admin.email,
                "full_name": admin.full_name,
                "organization_id": organization.id,
                "role": admin_role.to_dict()
            }
        }

    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Organization creation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create organization: {str(e)}"
        )


@router.get("/setup-status", response_model=dict)
async def is_organization_setup(
    db: Session = Depends(get_db)
):
    """Check if at least one active organization is set up."""
    try:
        active_org_exists = db.query(Organization.id)\
            .filter(Organization.is_active == True)\
            .first() is not None
        
        return {"is_setup": active_org_exists}
    except Exception as e:
        logger.error(f"Failed to check organization setup status: {str(e)}", exc_info=True)
        # In case of error, conservatively assume setup might be needed or report error
        # Returning False might lock users out if DB is temporarily unavailable
        # A 500 error might be better to indicate a server issue
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check organization setup status"
        )


@router.get("/check-domain/{domain}")
async def check_domain_availability(
    domain: str,
    db: Session = Depends(get_db)
):
    """Check if an organization domain is available"""
    try:
        existing_org = db.query(Organization).filter(Organization.domain == domain).first()
        return {
            "available": not existing_org,
            "message": "Domain is available" if not existing_org else "Domain already exists"
        }
    except Exception as e:
        logger.error(f"Failed to check domain availability: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check domain availability"
        )


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get organization by ID"""
    try:
        org = db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )
        return org
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Failed to get organization {
                     org_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve organization. Please try again later."
        )


@router.patch("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: UUID,
    org_data: OrganizationUpdate,
    current_user: User = Depends(require_permissions("manage_organization")),
    db: Session = Depends(get_db)
):
    """Update organization details including business hours"""
    try:
        org = db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Organization not found"
            )

        # Update only provided fields
        update_data = org_data.model_dump(exclude_unset=True)
        
        # Validate business hours if provided
        if 'business_hours' in update_data:
            business_hours = update_data['business_hours']
            required_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            required_fields = ['start', 'end', 'enabled']
            
            # Validate all days are present
            if not all(day in business_hours for day in required_days):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Business hours must include all days of the week"
                )
            
            # Validate each day has required fields
            for day in required_days:
                if not all(field in business_hours[day] for field in required_fields):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Business hours for {day} must include start, end, and enabled status"
                    )
                
                # Validate time format (HH:MM)
                start = business_hours[day]['start']
                end = business_hours[day]['end']
                try:
                    hours, minutes = start.split(':')
                    if not (0 <= int(hours) <= 23 and 0 <= int(minutes) <= 59):
                        raise ValueError
                    hours, minutes = end.split(':')
                    if not (0 <= int(hours) <= 23 and 0 <= int(minutes) <= 59):
                        raise ValueError
                except ValueError:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Invalid time format for {day}. Use HH:MM format (24-hour)"
                    )

        for field, value in update_data.items():
            setattr(org, field, value)

        db.commit()
        db.refresh(org)

        # Update CORS origins after updating organization
        update_cors_middleware(app)

        return org
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update organization {org_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update organization. Please try again later."
        )


# @router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_organization(
#     org_id: UUID,
#     current_user: User = Depends(require_permissions("manage_organization")),
#     db: Session = Depends(get_db)
# ):
#     """
#     Hard delete organization and all related data.
    
#     This operation permanently removes:
#     - Users and their notifications, knowledge queue items, session assignments, ratings
#     - Customers and their ratings, chat histories
#     - Agents and their customizations, widgets, knowledge links, tool links, ratings, chat histories
#     - Workflows and workflow nodes
#     - Enterprise subscriptions and PayPal orders (if available)
#     - AI configurations
#     - Knowledge sources and knowledge-to-agent links
#     - MCP tools and their agent links
#     - User groups
#     - Roles and their permission associations
#     - Integration data (Shopify shops, Jira tokens)
#     - All remaining chat histories
#     - The organization itself
    
#     WARNING: This operation cannot be undone.
#     """
#     try:
#         # Check if organization exists
#         org = db.query(Organization).filter(Organization.id == org_id).first()
#         if not org:
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="Organization not found"
#             )

#         # Verify user belongs to this organization
#         if current_user.organization_id != org_id:
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail="You can only delete your own organization"
#             )

#         logger.info(f"Starting hard delete for organization {org_id}")

#         # Import models that might not be available in all environments
#         try:
#             from app.enterprise.models.subscription import Subscription
#             from app.enterprise.models.order import PayPalOrder
#             enterprise_available = True
#         except ImportError:
#             enterprise_available = False
#             logger.info("Enterprise models not available")

#         # Import all required models
#         from app.models.user import User, UserGroup
#         from app.models.role import Role
#         from app.models.permission import Permission
#         from app.models.agent import Agent, AgentCustomization
#         from app.models.widget import Widget
#         from app.models.ai_config import AIConfig
#         from app.models.knowledge import Knowledge
#         from app.models.knowledge_to_agent import KnowledgeToAgent
#         from app.models.knowledge_queue import KnowledgeQueue
#         from app.models.chat_history import ChatHistory
#         from app.models.customer import Customer
#         from app.models.session_to_agent import SessionToAgent
#         from app.models.rating import Rating
#         from app.models.workflow import Workflow
#         from app.models.workflow_node import WorkflowNode
#         from app.models.mcp_tool import MCPTool, MCPToolToAgent
#         from app.models.notification import Notification
#         from app.models.shopify.shopify_shop import ShopifyShop
#         from app.models.jira import JiraToken

#         # 1. Delete users and their related data first
#         logger.info("Deleting users and related data...")
#         users = db.query(User).filter(User.organization_id == org_id).all()
#         for user in users:
#             # Delete user notifications
#             db.query(Notification).filter(Notification.user_id == user.id).delete()
#             # Delete user knowledge queue items
#             db.query(KnowledgeQueue).filter(KnowledgeQueue.user_id == user.id).delete()
#             # Delete user session assignments
#             db.query(SessionToAgent).filter(SessionToAgent.user_id == user.id).delete()
#             # Delete user ratings
#             db.query(Rating).filter(Rating.user_id == user.id).delete()
        
#         # Delete users themselves (this will cascade to user_groups via the association table)
#         db.query(User).filter(User.organization_id == org_id).delete()

#         # 2. Delete customer-related data
#         logger.info("Deleting customer data...")
#         customers = db.query(Customer).filter(Customer.organization_id == org_id).all()
#         for customer in customers:
#             # Delete customer ratings
#             db.query(Rating).filter(Rating.customer_id == customer.id).delete()
#             # Delete customer chat histories
#             db.query(ChatHistory).filter(ChatHistory.customer_id == customer.id).delete()
        
#         # Delete customers
#         db.query(Customer).filter(Customer.organization_id == org_id).delete()

#         # 3. Delete agents and their related data
#         logger.info("Deleting agents and related data...")
#         agents = db.query(Agent).filter(Agent.organization_id == org_id).all()
#         for agent in agents:
#             # Delete agent customizations
#             db.query(AgentCustomization).filter(AgentCustomization.agent_id == agent.id).delete()
#             # Delete widgets for this agent
#             db.query(Widget).filter(Widget.agent_id == agent.id).delete()
#             # Delete knowledge-to-agent links
#             db.query(KnowledgeToAgent).filter(KnowledgeToAgent.agent_id == agent.id).delete()
#             # Delete MCP tool-to-agent links
#             db.query(MCPToolToAgent).filter(MCPToolToAgent.agent_id == agent.id).delete()
#             # Delete agent session assignments
#             db.query(SessionToAgent).filter(SessionToAgent.agent_id == agent.id).delete()
#             # Delete agent ratings
#             db.query(Rating).filter(Rating.agent_id == agent.id).delete()
#             # Delete agent chat histories
#             db.query(ChatHistory).filter(ChatHistory.agent_id == agent.id).delete()
        
#         # Delete agents themselves
#         db.query(Agent).filter(Agent.organization_id == org_id).delete()

#         # 4. Delete workflows and workflow nodes
#         logger.info("Deleting workflows...")
#         workflows = db.query(Workflow).filter(Workflow.organization_id == org_id).all()
#         for workflow in workflows:
#             # Delete workflow nodes
#             db.query(WorkflowNode).filter(WorkflowNode.workflow_id == workflow.id).delete()
        
#         # Delete workflows
#         db.query(Workflow).filter(Workflow.organization_id == org_id).delete()

#         # 5. Delete remaining widgets (not associated with agents)
#         logger.info("Deleting remaining widgets...")
#         db.query(Widget).filter(Widget.organization_id == org_id).delete()

#         # 6. Delete enterprise subscriptions and orders if available
#         if enterprise_available:
#             logger.info("Deleting enterprise subscriptions and orders...")
#             # Delete PayPal orders first (they reference subscriptions)
#             db.query(PayPalOrder).filter(PayPalOrder.organization_id == org_id).delete()
#             # Delete subscriptions
#             db.query(Subscription).filter(Subscription.organization_id == org_id).delete()

#         # 7. Delete AI configs
#         logger.info("Deleting AI configs...")
#         db.query(AIConfig).filter(AIConfig.organization_id == org_id).delete()

#         # 8. Delete knowledge sources and related data
#         logger.info("Deleting knowledge sources...")
#         knowledge_sources = db.query(Knowledge).filter(Knowledge.organization_id == org_id).all()
#         for knowledge in knowledge_sources:
#             # Delete any remaining knowledge-to-agent links
#             db.query(KnowledgeToAgent).filter(KnowledgeToAgent.knowledge_id == knowledge.id).delete()
        
#         # Delete knowledge sources
#         db.query(Knowledge).filter(Knowledge.organization_id == org_id).delete()

#         # 9. Delete remaining knowledge queue items
#         logger.info("Deleting knowledge queue items...")
#         db.query(KnowledgeQueue).filter(KnowledgeQueue.organization_id == org_id).delete()

#         # 10. Delete MCP tools
#         logger.info("Deleting MCP tools...")
#         mcp_tools = db.query(MCPTool).filter(MCPTool.organization_id == org_id).all()
#         for tool in mcp_tools:
#             # Delete any remaining MCP tool-to-agent links
#             db.query(MCPToolToAgent).filter(MCPToolToAgent.mcp_tool_id == tool.id).delete()
        
#         # Delete MCP tools
#         db.query(MCPTool).filter(MCPTool.organization_id == org_id).delete()

#         # 11. Delete user groups
#         logger.info("Deleting user groups...")
#         db.query(UserGroup).filter(UserGroup.organization_id == org_id).delete()

#         # 12. Delete roles and their permission associations
#         logger.info("Deleting roles and their permissions...")
        
#         # First, directly delete entries from the role_permissions association table
#         from app.models.permission import role_permissions
        
#         # Get all role IDs for this organization
#         role_ids = [role_id for role_id, in db.query(Role.id).filter(Role.organization_id == org_id).all()]
        
#         if role_ids:
#             # Delete from the association table using raw SQL
#             # This is necessary because SQLAlchemy ORM doesn't directly support bulk deletion from association tables
#             delete_stmt = role_permissions.delete().where(role_permissions.c.role_id.in_(role_ids))
#             db.execute(delete_stmt)
#             db.flush()
        
#         # Now delete the roles
#         db.query(Role).filter(Role.organization_id == org_id).delete()

#         # 13. Delete integration-specific data
#         logger.info("Deleting integration data...")
#         # Delete Shopify shops
#         db.query(ShopifyShop).filter(ShopifyShop.organization_id == org_id).delete()
#         # Delete Jira tokens
#         db.query(JiraToken).filter(JiraToken.organization_id == org_id).delete()

#         # 14. Delete any remaining chat histories
#         logger.info("Deleting remaining chat histories...")
#         db.query(ChatHistory).filter(ChatHistory.organization_id == org_id).delete()

#         # 15. Finally, delete the organization itself
#         logger.info("Deleting organization...")
#         db.delete(org)

#         # Commit all changes
#         db.commit()
#         logger.info(f"Successfully hard deleted organization {org_id}")

#         # Update CORS origins after deleting organization
#         update_cors_middleware(app)

#         return None
#     except HTTPException as he:
#         db.rollback()
#         raise he
#     except Exception as e:
#         db.rollback()
#         logger.error(f"Failed to delete organization {org_id}: {str(e)}", exc_info=True)
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail="Failed to delete organization. Please try again later."
#         )


@router.get("/{org_id}/stats")
async def get_organization_stats(
    org_id: UUID,
    current_user: User = Depends(require_permissions("view_organization")),
    db: Session = Depends(get_db)
):
    """Get organization statistics"""
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )

    return {
        "total_users": db.query(User).filter(User.organization_id == org_id).count(),
        "active_users": db.query(User).filter(
            User.organization_id == org_id,
            User.is_active == True
        ).count(),
        "settings": org.settings
    }
