"""
ChatterMate - MCP Manager Tests
"""

import pytest
import asyncio
from unittest.mock import patch, AsyncMock, MagicMock
from uuid import uuid4

from app.tools.mcp_manager import MCPToolsManager, initialize_mcp_tools, cleanup_mcp_tools


@pytest.mark.asyncio
async def test_initialize_mcp_tools_no_ids():
    manager = MCPToolsManager()
    tools = await manager.initialize_mcp_tools(agent_id="", org_id="")
    assert tools == []


@pytest.mark.asyncio
async def test_initialize_mcp_tools_stdio_success():
    manager = MCPToolsManager()
    agent_id = str(uuid4())
    org_id = str(uuid4())

    # Mock repo to return a single STDIO tool config
    mock_tool_config = MagicMock()
    mock_tool_config.name = "FS Tool"
    mock_tool_config.transport_type = type("T", (), {"__eq__": lambda s, o: False})()  # placeholder
    from app.models.mcp_tool import MCPTransportType
    mock_tool_config.transport_type = MCPTransportType.STDIO
    mock_tool_config.command = "npx"
    mock_tool_config.args = ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
    mock_tool_config.env_vars = {"FOO": "bar"}

    with patch("app.tools.mcp_manager.SessionLocal") as mock_sess_local, \
         patch("app.tools.mcp_manager.MCPToolRepository") as mock_repo_cls, \
         patch("app.tools.mcp_manager.MCPTools") as mock_mcp_tools_cls:

        mock_db = MagicMock()
        mock_sess_local.return_value.__enter__.return_value = mock_db
        mock_repo = MagicMock()
        mock_repo.get_agent_mcp_tools.return_value = [mock_tool_config]
        mock_repo_cls.return_value = mock_repo

        # Mock MCPTools async context manager
        mock_mcp_instance = AsyncMock()
        # Simulate that functions are available after connect
        mock_mcp_instance.functions = {"list": MagicMock()}
        mock_mcp_tools_cls.return_value = mock_mcp_instance

        tools = await manager.initialize_mcp_tools(agent_id, org_id)

        assert len(tools) == 1
        mock_repo.get_agent_mcp_tools.assert_called_once_with(agent_id)
        # __aenter__ called to connect
        mock_mcp_instance.__aenter__.assert_awaited()


@pytest.mark.asyncio
async def test_initialize_mcp_tools_stdio_missing_dirs_skips():
    manager = MCPToolsManager()
    agent_id = str(uuid4())
    org_id = str(uuid4())

    # Tool without directories and without env var should be skipped
    mock_tool_config = MagicMock()
    from app.models.mcp_tool import MCPTransportType
    mock_tool_config.transport_type = MCPTransportType.STDIO
    mock_tool_config.name = "FS Tool"
    mock_tool_config.command = "npx"
    mock_tool_config.args = ["-y", "@modelcontextprotocol/server-filesystem"]  # no dirs after package
    mock_tool_config.env_vars = {}  # no ALLOWED_DIRECTORIES

    with patch("app.tools.mcp_manager.SessionLocal") as mock_sess_local, \
         patch("app.tools.mcp_manager.MCPToolRepository") as mock_repo_cls, \
         patch("app.tools.mcp_manager.MCPTools") as mock_mcp_tools_cls:

        mock_db = MagicMock()
        mock_sess_local.return_value.__enter__.return_value = mock_db
        mock_repo = MagicMock()
        mock_repo.get_agent_mcp_tools.return_value = [mock_tool_config]
        mock_repo_cls.return_value = mock_repo

        tools = await manager.initialize_mcp_tools(agent_id, org_id)

        assert tools == []  # skipped
        mock_mcp_tools_cls.assert_not_called()


@pytest.mark.asyncio
async def test_cleanup_mcp_tools_calls_disconnects():
    manager = MCPToolsManager()
    tool1 = AsyncMock()
    tool2 = AsyncMock()
    manager.mcp_tools = [tool1, tool2]

    await manager.cleanup_mcp_tools()

    # Attempted to cleanup via __aexit__ first
    tool1.__aexit__.assert_awaited()
    tool2.__aexit__.assert_awaited()
    assert manager.mcp_tools == []


@pytest.mark.asyncio
async def test_initialize_and_cleanup_helpers():
    # High level helper functions
    with patch("app.tools.mcp_manager.MCPToolsManager") as mock_mgr_cls:
        mock_mgr = AsyncMock()
        mock_mgr.initialize_mcp_tools.return_value = []
        mock_mgr.cleanup_mcp_tools.return_value = None
        mock_mgr_cls.return_value = mock_mgr

        tools = await initialize_mcp_tools(agent_id="a", org_id="o")
        assert tools == []

        await cleanup_mcp_tools([])
        mock_mgr.cleanup_mcp_tools.assert_awaited()


