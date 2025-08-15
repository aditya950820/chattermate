"""
ChatterMate - User
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

from app.models.user import User
from app.models.notification import Notification
from app.core.logger import get_logger
from firebase_admin import messaging

logger = get_logger(__name__)


async def send_fcm_notification(user_id: str, notification: Notification, db):
    """Send FCM notification to user"""
    try:
        # Get user's FCM token
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.fcm_token_web:
            return

        # Create FCM message
        message = messaging.Message(
            notification=messaging.Notification(
                title=notification.title,
                body=notification.message,
            ),
            data={
                'type': notification.type,
                'notification_id': str(notification.id),
                'metadata': str(notification.notification_metadata or {})
            },
            token=user.fcm_token_web,
        )

        # Send message
        response = messaging.send(message)
        logger.info(f"Successfully sent FCM notification: {response}")

    except Exception as e:
        logger.error(f"Failed to send FCM notification: {str(e)}")
