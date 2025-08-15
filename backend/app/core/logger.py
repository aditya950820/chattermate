"""
ChatterMate - Logger
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

import logging
import sys
from logging.handlers import RotatingFileHandler
import os

# Dictionary to store loggers by name
_loggers = {}


def get_logger(name=None):
    """
    Get or create a logger instance.
    Args:
        name: The name for the logger (typically __name__ from the calling module)
    Returns:
        A configured logger instance
    """
    # Use the provided name or default to 'app'
    logger_name = name or 'app'

    # Return existing logger if already created
    if logger_name in _loggers:
        return _loggers[logger_name]

    # Create new logger
    logger = logging.getLogger(logger_name)

    # Only set up handlers if they haven't been set up already
    if not logger.handlers:
        logger.setLevel(logging.DEBUG)

        # Create formatters and handlers
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )

        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        # File handler
        log_dir = 'logs'
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)

        file_handler = RotatingFileHandler(
            f'{log_dir}/app.log',
            maxBytes=10485760,  # 10MB
            backupCount=5
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    # Store logger in dictionary
    _loggers[logger_name] = logger
    return logger
