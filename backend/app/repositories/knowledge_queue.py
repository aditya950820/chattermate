"""
ChatterMate - Knowledge Queue
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
from app.models.knowledge_queue import KnowledgeQueue, QueueStatus
from typing import List, Optional
from datetime import datetime
from app.core.logger import get_logger
from app.core.logger import get_logger

logger = get_logger(__name__)


class KnowledgeQueueRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, queue_item: KnowledgeQueue) -> KnowledgeQueue:
        self.db.add(queue_item)
        self.db.commit()
        self.db.refresh(queue_item)
        return queue_item

    def get_by_id(self, queue_id: int) -> Optional[KnowledgeQueue]:
        """Get queue item by ID"""
        return self.db.query(KnowledgeQueue).filter(
            KnowledgeQueue.id == queue_id
        ).first()

    def get_pending(self) -> List[KnowledgeQueue]:
        """Get all pending queue items"""
        return self.db.query(KnowledgeQueue)\
            .filter(KnowledgeQueue.status == QueueStatus.PENDING)\
            .all()

    def update_status(self, queue_id: int, status: QueueStatus, error: Optional[str] = None) -> bool:
        item = self.db.query(KnowledgeQueue).filter(
            KnowledgeQueue.id == queue_id).first()
        if item:
            item.status = status
            item.error = error
            # Update processing stage to COMPLETED when status is COMPLETED
            if status == QueueStatus.COMPLETED:
                item.processing_stage = "COMPLETED"
                item.progress_percentage = 100.0
            self.db.commit()
            return True
        return False
        
    def update_progress(
        self, 
        queue_id: int, 
        processing_stage: str = None, 
        progress_percentage: float = None,
        total_items: int = None,
        processed_items: int = None,
        crawled_url: str = None,
        force_stage_update: bool = False
    ) -> bool:
        """Update the progress of a queue item"""
        item = self.db.query(KnowledgeQueue).filter(
            KnowledgeQueue.id == queue_id).first()
        if item:
            # Define stage priority to prevent regression
            stage_priority = {
                "not_started": 0,
                "crawling": 1,
                "embedding": 2,
                "completed": 3
            }
            
            # Only update processing stage if it's an advancement or forced
            if processing_stage and (force_stage_update or not item.processing_stage or 
                stage_priority.get(processing_stage.lower(), 0) >= stage_priority.get(item.processing_stage.lower(), 0)):
                item.processing_stage = processing_stage
            
            # Update progress percentage using main columns
            if progress_percentage is not None:
                item.progress_percentage = progress_percentage
            elif processed_items is not None and total_items is not None and total_items > 0:
                # Auto-calculate percentage based on processed/total items
                item.progress_percentage = (processed_items / total_items) * 100
                
            if total_items is not None:
                item.total_items = total_items
                
            if processed_items is not None:
                item.processed_items = processed_items
            
            # Add crawled URL to the list if provided (store only URL strings)
            if crawled_url:
                if not item.crawled_urls:
                    item.crawled_urls = []
                # Store only the URL string, no timestamp or status
                if crawled_url not in item.crawled_urls:
                    # Create a new list to ensure SQLAlchemy detects the change
                    new_crawled_urls = list(item.crawled_urls) if item.crawled_urls else []
                    new_crawled_urls.append(crawled_url)
                    item.crawled_urls = new_crawled_urls
                    
                    # Mark the attribute as modified to ensure SQLAlchemy commits the change
                    from sqlalchemy.orm.attributes import flag_modified
                    flag_modified(item, 'crawled_urls')
                    
                    from app.core.logger import get_logger
                    logger = get_logger(__name__)
                    logger.debug(f"📝 Added crawled URL to queue {queue_id}: {crawled_url} (total: {len(item.crawled_urls)})")
                    
                else:
                    from app.core.logger import get_logger
                    logger = get_logger(__name__)
                    logger.debug(f"🔄 URL already in list for queue {queue_id}: {crawled_url}")
                    
            # Commit changes and verify
            self.db.commit()
            
            # If we added a crawled URL, verify it was saved
            if crawled_url:
                self.db.refresh(item)
                from app.core.logger import get_logger
                logger = get_logger(__name__)
                logger.debug(f"🔍 After commit - queue {queue_id} crawled_urls count: {len(item.crawled_urls) if item.crawled_urls else 0}")
            
            return True
        return False