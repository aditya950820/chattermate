"""
ChatterMate - Test Socketio
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
import socketio

from app.core.socketio import configure_socketio, sio, socket_app


def test_configure_socketio_with_cors():
    """Test configuring socketio with CORS origins"""
    # Test with a string
    with patch.object(sio.eio, 'cors_allowed_origins', None):
        configure_socketio(cors_origins="https://example.com")
        assert sio.eio.cors_allowed_origins == ["https://example.com"]
    
    # Test with a list
    with patch.object(sio.eio, 'cors_allowed_origins', None):
        configure_socketio(cors_origins=["https://example1.com", "https://example2.com"])
        assert sio.eio.cors_allowed_origins == ["https://example1.com", "https://example2.com"]
    
    # Test with a set
    with patch.object(sio.eio, 'cors_allowed_origins', None):
        configure_socketio(cors_origins={"https://example1.com", "https://example2.com"})
        assert isinstance(sio.eio.cors_allowed_origins, list)
        assert set(sio.eio.cors_allowed_origins) == {"https://example1.com", "https://example2.com"}


@patch('app.core.socketio.settings')
def test_configure_socketio_with_redis_disabled(mock_settings):
    """Test configuring socketio with Redis disabled"""
    # Reset client manager before test
    sio.client_manager = None
    
    # Configure mock
    mock_settings.REDIS_ENABLED = False
    
    # Call the function
    configure_socketio()
    
    # Verify Redis manager was not configured
    if hasattr(sio, 'client_manager'):
        assert not isinstance(sio.client_manager, socketio.AsyncRedisManager)
    # If client_manager doesn't exist, the test passes implicitly


@patch('app.core.socketio.settings')
@patch('socketio.AsyncRedisManager')
def test_configure_socketio_with_redis_enabled(mock_redis_manager, mock_settings):
    """Test configuring socketio with Redis enabled"""
    # Configure mocks
    mock_settings.REDIS_ENABLED = True
    mock_settings.REDIS_URL = "redis://localhost:6379"
    mock_redis_instance = MagicMock()
    mock_redis_manager.return_value = mock_redis_instance
    
    # Call the function
    configure_socketio()
    
    # Verify Redis manager was configured
    mock_redis_manager.assert_called_once_with(
        "redis://localhost:6379",
        write_only=False,
        channel='chattermate',
        redis_options={
            'retry_on_timeout': True,
            'health_check_interval': 30,
            'socket_timeout': 5.0,
            'socket_connect_timeout': 5.0,
            'ssl_cert_reqs': None
        }
    )
    
    # Reset for next test
    sio.client_manager = None


@patch('app.core.socketio.settings')
@patch('socketio.AsyncRedisManager')
def test_configure_socketio_with_elasticache(mock_redis_manager, mock_settings):
    """Test configuring socketio with ElastiCache Redis URL"""
    # Configure mocks
    mock_settings.REDIS_ENABLED = True
    mock_settings.REDIS_URL = "redis://my-cluster.cache.amazonaws.com:6379"
    mock_redis_instance = MagicMock()
    mock_redis_manager.return_value = mock_redis_instance
    
    # Call the function
    configure_socketio()
    
    # Verify Redis manager was configured with TLS URL
    mock_redis_manager.assert_called_once_with(
        "rediss://my-cluster.cache.amazonaws.com:6379",
        write_only=False,
        channel='chattermate',
        redis_options={
            'retry_on_timeout': True,
            'health_check_interval': 30,
            'socket_timeout': 5.0,
            'socket_connect_timeout': 5.0,
            'ssl_cert_reqs': None
        }
    )
    
    # Reset for next test
    sio.client_manager = None


@patch('app.core.socketio.settings')
@patch('socketio.AsyncRedisManager')
def test_configure_socketio_with_redis_exception(mock_redis_manager, mock_settings):
    """Test configuring socketio with Redis that raises an exception"""
    # Configure mocks
    mock_settings.REDIS_ENABLED = True
    mock_settings.REDIS_URL = "redis://localhost:6379"
    mock_redis_manager.side_effect = Exception("Redis connection error")
    
    # Call the function - should not raise an exception
    configure_socketio()
    
    # Verify Redis manager was attempted
    mock_redis_manager.assert_called_once()
    
    # Reset for next test
    sio.client_manager = None 