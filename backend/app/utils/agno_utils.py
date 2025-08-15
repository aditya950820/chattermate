"""
ChatterMate - Agno Utilities
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

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from app.core.logger import get_logger
from app.core.config import settings
from typing import Dict, Any, Optional, List
from fastapi import HTTPException

logger = get_logger(__name__)

def create_model(model_type: str, api_key: str, model_name: str, max_tokens: int = 1000, response_format: Optional[Dict[str, Any]] = None) -> Any:
    """
    Create and return the specified model based on model_type.
    
    Args:
        model_type: The type of model (OPENAI, GROQ, etc.)
        api_key: The API key
        model_name: The name/ID of the model
        max_tokens: Maximum tokens for model output
        response_format: Optional response format specification
        
    Returns:
        The initialized model object
        
    Raises:
        HTTPException: If the model type is not supported
    """
    model_type = model_type.upper()
    
    try:
        if model_type == 'OPENAI' or model_type == 'CHATTERMATE': # own model for enterprise customers
            if response_format:
                return OpenAIChat(api_key=api_key, id=model_name, max_tokens=max_tokens, response_format=response_format)
            else:
                return OpenAIChat(api_key=api_key, id=model_name, max_tokens=max_tokens)
        elif model_type == 'ANTHROPIC':
            from agno.models.anthropic import Claude
            return Claude(api_key=api_key, id=model_name, max_tokens=max_tokens)
        elif model_type == 'DEEPSEEK':
            from agno.models.deepseek import DeepSeekChat
            return DeepSeekChat(api_key=api_key, id=model_name, max_tokens=max_tokens)
        elif model_type == 'GOOGLE':
            from agno.models.google import Gemini
            return Gemini(api_key=api_key, id=model_name, max_tokens=max_tokens)
        elif model_type == 'GOOGLEVERTEX':
            from agno.models.vertexai import Gemini
            return Gemini(api_key=api_key, id=model_name, max_tokens=max_tokens)
        elif model_type == 'GROQ':
            from agno.models.groq import Groq
            if response_format:
                return Groq(api_key=api_key, id=model_name, max_tokens=max_tokens, response_format=response_format)
            else:
                return Groq(api_key=api_key, id=model_name, max_tokens=max_tokens, response_format={"type": "text"})
        elif model_type == 'MISTRAL':
            from agno.models.mistral import MistralChat
            return MistralChat(api_key=api_key, id=model_name, max_tokens=max_tokens)
        elif model_type == 'HUGGINGFACE':
            from agno.models.huggingface import HuggingFaceChat
            return HuggingFaceChat(api_key=api_key, id=model_name, max_tokens=max_tokens)
        elif model_type == 'OLLAMA':
            from agno.models.ollama import Ollama
            return Ollama(id=model_name)
        elif model_type == 'XAI':
            from agno.models.xai import xAI
            return xAI(api_key=api_key, id=model_name, max_tokens=max_tokens)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
    except ImportError as e:
        logger.error(f"Import error when creating model type {model_type}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Model type {model_type} is not available in this installation")
    except Exception as e:
        logger.error(f"Error creating model type {model_type}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to initialize model: {str(e)}")

async def test_model_api_key(api_key: str, model_type: str, model_name: str) -> bool:
    """
    Test if the API key is valid for the given model type.
    
    Args:
        api_key: The API key to test
        model_type: The type of model
        model_name: The name of the model
        
    Returns:
        bool: True if the API key is valid, False otherwise
    """
    try:
        # Create a simple model and agent for testing
        model = create_model(model_type, api_key, model_name)
        test_agent = Agent(
            name="Test Agent",
            model=model,
            instructions="You are a test agent. Just respond with 'Test successful.'",
            debug_mode=False
        )
        
        # Run a simple test query
        await test_agent.arun(message="This is a test message.")
        return True
    except Exception as e:
        logger.error(f"API key test failed: {str(e)}")
        return False 