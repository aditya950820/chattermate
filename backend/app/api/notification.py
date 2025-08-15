"""
ChatterMate - Notification
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

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.core.auth import get_current_user
from app.models.notification import Notification
from app.models.schemas.notification import NotificationResponse
from app.core.logger import get_logger
from app.services.user import send_fcm_notification

router = APIRouter()
logger = get_logger(__name__)


@router.get("", response_model=List[NotificationResponse])
async def list_notifications(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's notifications with pagination"""
    try:
        notifications = db.query(Notification)\
            .filter(Notification.user_id == current_user.id)\
            .order_by(Notification.created_at.desc())\
            .offset(skip)\
            .limit(limit)\
            .all()

        return notifications
    except Exception as e:
        logger.error(f"Error fetching notifications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch notifications"
        )


@router.patch("/{notification_id}/read")
async def mark_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read"""
    try:
        notification = db.query(Notification)\
            .filter(
                Notification.id == notification_id,
                Notification.user_id == current_user.id
        ).first()

        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )

        notification.is_read = True
        db.commit()

        return {"message": "Notification marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking notification as read: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update notification"
        )


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get count of unread notifications"""
    try:
        count = db.query(Notification)\
            .filter(
                Notification.user_id == current_user.id,
                Notification.is_read == False
        ).count()
        return {"count": count}
    except Exception as e:
        logger.error(f"Error getting unread count: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get unread count"
        )


@router.post("/test")
async def send_test_notification(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a test notification to the current user"""
    try:
        # Create test notification
        notification = Notification(
            user_id=current_user.id,
            type="CHAT",
            title="Test Notification",
            message="This is a test notification from ChatterMate",
            notification_metadata={"test": True}
        )
        db.add(notification)
        db.commit()
        # Send FCM notification
        await send_fcm_notification(current_user.id, notification, db)

        return {"message": "Test notification sent successfully"}
    except Exception as e:
        logger.error(f"Error sending test notification: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send test notification"
        )
