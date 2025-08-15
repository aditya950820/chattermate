"""
ChatterMate - Session To Agent
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

from app.repositories.session_to_agent import SessionToAgentRepository
from app.repositories.chat import ChatRepository
from app.models.schemas.chat import ChatDetailResponse
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.core.logger import get_logger
from app.models.user import User
from app.core.auth import get_current_user
from app.database import get_db


logger = get_logger(__name__)

router = APIRouter()


@router.post("/{session_id}/takeover", response_model=ChatDetailResponse)
async def takeover_chat(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Take over a chat session"""
    try:
        # Check permissions
        user_permissions = {p.name for p in current_user.role.permissions}
        if not ("manage_chats" in user_permissions or "manage_assigned_chats" in user_permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )

        # Get session
        session_repo = SessionToAgentRepository(db)
        session = session_repo.get_session(session_id)
        
        if not session:
            raise HTTPException(
                status_code=404,
                detail="Chat session not found"
            )

        # Update session
        success = session_repo.takeover_session(
            session_id=session_id,
            user_id=str(current_user.id)
        )

        if not success:
            raise HTTPException(
                status_code=400,
                detail="Failed to take over chat"
            )

        # Get updated chat details
        chat_repo = ChatRepository(db)
        chat = await chat_repo.get_chat_detail(
            session_id=session_id,
            org_id=current_user.organization_id
        )

        if not chat:
            raise HTTPException(
                status_code=500,
                detail="Failed to get chat details after takeover"
            )

        return ChatDetailResponse(**chat)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error taking over chat: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to take over chat"
        )

