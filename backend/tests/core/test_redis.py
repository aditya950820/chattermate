"""
ChatterMate - Redis Module Tests
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

import pytest
from unittest.mock import patch, MagicMock

@patch('app.core.redis.redis')
@patch('app.core.redis.settings')
def test_init_redis_disabled(mock_settings, mock_redis):
    """Test Redis initialization when Redis is disabled"""
    from app.core.redis import init_redis
    
    # Set up the mock
    mock_settings.REDIS_ENABLED = False
    
    # Call the function
    result = init_redis()
    
    # Verify that no Redis connection was created
    assert result is None
    mock_redis.from_url.assert_not_called()

@patch('app.core.redis.redis')
@patch('app.core.redis.settings')
def test_init_redis_standard_url(mock_settings, mock_redis):
    """Test Redis initialization with a standard Redis URL"""
    from app.core.redis import init_redis
    
    # Set up the mocks
    mock_settings.REDIS_ENABLED = True
    mock_settings.REDIS_URL = "redis://localhost:6379"
    mock_redis_client = MagicMock()
    mock_redis.from_url.return_value = mock_redis_client
    
    # Call the function
    result = init_redis()
    
    # Verify Redis was initialized with the correct parameters
    mock_redis.from_url.assert_called_once_with(
        "redis://localhost:6379",
        socket_timeout=5.0,
        socket_connect_timeout=5.0,
        decode_responses=True
    )
    mock_redis_client.ping.assert_called_once()
    assert result == mock_redis_client

@patch('app.core.redis.redis')
@patch('app.core.redis.settings')
def test_init_redis_aws_elasticache(mock_settings, mock_redis):
    """Test Redis initialization with AWS ElastiCache URL (should use TLS)"""
    from app.core.redis import init_redis
    
    # Set up the mocks
    mock_settings.REDIS_ENABLED = True
    mock_settings.REDIS_URL = "redis://my-cluster.cache.amazonaws.com:6379"
    mock_redis_client = MagicMock()
    mock_redis.from_url.return_value = mock_redis_client
    
    # Call the function
    result = init_redis()
    
    # Verify Redis was initialized with TLS URL
    mock_redis.from_url.assert_called_once_with(
        "rediss://my-cluster.cache.amazonaws.com:6379",
        socket_timeout=5.0,
        socket_connect_timeout=5.0,
        decode_responses=True
    )
    mock_redis_client.ping.assert_called_once()
    assert result == mock_redis_client

@patch('app.core.redis.redis')
@patch('app.core.redis.settings')
def test_init_redis_connection_error(mock_settings, mock_redis):
    """Test Redis initialization with connection error"""
    from app.core.redis import init_redis
    
    # Set up the mocks
    mock_settings.REDIS_ENABLED = True
    mock_settings.REDIS_URL = "redis://localhost:6379"
    mock_redis_client = MagicMock()
    mock_redis.from_url.return_value = mock_redis_client
    mock_redis_client.ping.side_effect = Exception("Connection error")
    
    # Call the function
    result = init_redis()
    
    # Verify Redis client was created but ping failed
    mock_redis.from_url.assert_called_once()
    mock_redis_client.ping.assert_called_once()
    assert result is None

@patch('app.core.redis.init_redis')
@patch('app.core.redis.redis_client', None)  # Reset the global redis_client
@patch('app.core.redis.settings')
def test_get_redis_first_call(mock_settings, mock_init_redis):
    """Test get_redis when called for the first time"""
    from app.core.redis import get_redis
    
    # Set up the mocks
    mock_settings.REDIS_ENABLED = True
    mock_redis_client = MagicMock()
    mock_init_redis.return_value = mock_redis_client
    
    # Call the function
    result = get_redis()
    
    # Verify init_redis was called and the result is correct
    mock_init_redis.assert_called_once()
    assert result == mock_redis_client

@patch('app.core.redis.redis_client', MagicMock())  # Simulate existing redis_client
@patch('app.core.redis.init_redis')
@patch('app.core.redis.settings')
def test_get_redis_cached_client(mock_settings, mock_init_redis, monkeypatch):
    """Test get_redis when a Redis client is already cached"""
    from app.core.redis import get_redis, redis_client
    
    # Set up the mocks
    mock_settings.REDIS_ENABLED = True
    existing_client = redis_client  # Use the mocked redis_client
    
    # Call the function
    result = get_redis()
    
    # Verify init_redis was not called and the existing client is returned
    mock_init_redis.assert_not_called()
    assert result == existing_client

@patch('app.core.redis.redis_client', None)  # Reset the global redis_client
@patch('app.core.redis.settings')
def test_get_redis_disabled(mock_settings):
    """Test get_redis when Redis is disabled"""
    from app.core.redis import get_redis
    
    # Set up the mocks
    mock_settings.REDIS_ENABLED = False
    
    # Call the function
    result = get_redis()
    
    # Verify no Redis client was initialized or returned
    assert result is None 