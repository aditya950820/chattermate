from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.database import Base

class JiraToken(Base):
    """Model for storing Jira OAuth tokens."""
    __tablename__ = "jira_tokens"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    token_type = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    cloud_id = Column(String, nullable=False)  # Jira Cloud instance ID
    site_url = Column(String, nullable=False)  # Jira instance URL
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    organization = relationship("Organization", back_populates="jira_tokens")

class AgentJiraConfig(Base):
    """Model for storing agent-to-Jira configuration."""
    __tablename__ = "agent_jira_configs"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(String, nullable=False, index=True)
    enabled = Column(Boolean, default=False, nullable=False)
    project_key = Column(String, nullable=True)
    issue_type_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 