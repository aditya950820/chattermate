"""
ChatterMate - Knowledge To Agent
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
from app.models.knowledge_to_agent import KnowledgeToAgent
from typing import List, Optional
from uuid import UUID

class KnowledgeToAgentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_ids(self, knowledge_id: int, agent_id: UUID) -> Optional[KnowledgeToAgent]:
        """Get a link by knowledge_id and agent_id"""
        return self.db.query(KnowledgeToAgent).filter(
            KnowledgeToAgent.knowledge_id == knowledge_id,
            KnowledgeToAgent.agent_id == agent_id
        ).first()

    def get_by_agent(self, agent_id: UUID) -> List[KnowledgeToAgent]:
        """Get all knowledge sources for an agent"""
        return self.db.query(KnowledgeToAgent).filter(
            KnowledgeToAgent.agent_id == agent_id
        ).all()

    def get_by_org(self, org_id: UUID) -> List[KnowledgeToAgent]:
        """Get all knowledge sources for an organization"""
        return self.db.query(KnowledgeToAgent).filter(
            KnowledgeToAgent.organization_id == org_id
        ).all()

    def create(self, knowledge_source: KnowledgeToAgent) -> KnowledgeToAgent:
        """Create a new knowledge source"""
        # Check if link already exists
        existing = self.get_by_ids(
            knowledge_source.knowledge_id,
            knowledge_source.agent_id
        )

        if existing:
            return existing

        self.db.add(knowledge_source)
        self.db.commit()
        self.db.refresh(knowledge_source)
        return knowledge_source

    def delete(self, source_id: int) -> bool:
        """Delete a knowledge source"""
        source = self.db.query(KnowledgeToAgent).filter(
            KnowledgeToAgent.id == source_id
        ).first()
        if source:
            self.db.delete(source)
            self.db.commit()
            return True
        return False

    def delete_by_ids(self, knowledge_id: int, agent_id: UUID) -> bool:
        """Delete a link by knowledge and agent IDs"""
        result = self.db.query(KnowledgeToAgent)\
            .filter(
                KnowledgeToAgent.knowledge_id == knowledge_id,
                KnowledgeToAgent.agent_id == agent_id
        ).delete()
        self.db.commit()
        return bool(result)
