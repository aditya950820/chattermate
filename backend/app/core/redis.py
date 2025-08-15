"""
ChatterMate - Redis Connection
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

import redis
from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)

redis_client = None

def init_redis():
    """Initialize Redis connection"""
    global redis_client
    
    if not settings.REDIS_ENABLED:
        logger.info("Redis is disabled")
        return None
        
    redis_url = settings.REDIS_URL
    if redis_url and redis_url.startswith("redis://") and ".cache.amazonaws.com" in redis_url:
        redis_url = "rediss://" + redis_url[8:]
        logger.info(f"Using TLS for Redis connection: {redis_url}")

    try:
        redis_client = redis.from_url(
            redis_url,
            socket_timeout=5.0,
            socket_connect_timeout=5.0,
            decode_responses=True  # Automatically decode responses to Python strings
        )
        
        # Test connection immediately
        redis_client.ping()
        logger.info("Redis connection successful")
        return redis_client
    except Exception as e:
        logger.error(f"Failed to initialize Redis client: {str(e)}")
        return None

def get_redis():
    """Get Redis client instance"""
    global redis_client
    
    if not redis_client and settings.REDIS_ENABLED:
        redis_client = init_redis()
    
    return redis_client 