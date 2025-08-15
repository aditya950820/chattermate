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

from sqlalchemy import Boolean, Column, Integer, String, JSON, ForeignKey, DateTime, func, Enum as SQLEnum
from sqlalchemy.orm import relationship
from enum import Enum
from app.database import Base
from sqlalchemy.dialects.postgresql import UUID

class AIModelType(str, Enum):
    OPENAI = "OPENAI"
    ANTHROPIC = "ANTHROPIC"
    DEEPSEEK = "DEEPSEEK"
    GOOGLE = "GOOGLE"
    GOOGLEVERTEX = "GOOGLEVERTEX"
    GROQ = "GROQ"
    MISTRAL = "MISTRAL"
    HUGGINGFACE = "HUGGINGFACE"
    OLLAMA = "OLLAMA"
    XAI = "XAI"
    CHATTERMATE = "CHATTERMATE" # own model for enterprise customers

class AIConfig(Base):
    __tablename__ = "ai_configs"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey(
        "organizations.id"), nullable=False)
    model_type = Column(SQLEnum(AIModelType), nullable=False)
    model_name = Column(String, nullable=False)  # e.g. "gpt-4", "claude-3"
    encrypted_api_key = Column(String, nullable=False)
    # For additional model-specific settings
    settings = Column(JSON, nullable=True, default={
        "instructions": [
            "You are a helpful customer service agent.",
            "Be concise and professional.",
            "If you don't know something, say so.",
            "Always maintain a friendly tone."
        ],
        "tools": ["web_search"],
        "memory": True,
        "markdown": True
    })
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(),
                        onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="ai_configs")
