FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat-traditional \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/app ./app
COPY backend/alembic.ini .
COPY backend/alembic ./alembic
COPY backend/scripts ./scripts
COPY backend/assets ./assets

# Create required directories including cache directories
RUN mkdir -p uploads/agents && \
    mkdir -p .cache/huggingface/transformers && \
    mkdir -p .cache/huggingface/sentence_transformers && \
    mkdir -p .cache/huggingface/hub && \
    mkdir -p .cache/torch && \
    mkdir -p .cache/pytorch_transformers && \
    chmod -R 755 .cache

# Make startup script executable
RUN chmod +x ./scripts/start.sh

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8000
# Set HuggingFace cache directories
ENV HF_HOME=/app/.cache/huggingface
ENV TRANSFORMERS_CACHE=/app/.cache/huggingface/transformers
ENV SENTENCE_TRANSFORMERS_HOME=/app/.cache/huggingface/sentence_transformers
ENV HF_HUB_CACHE=/app/.cache/huggingface/hub
ENV HF_HUB_DISABLE_TELEMETRY=1
# Set PyTorch cache directories
ENV TORCH_HOME=/app/.cache/torch
ENV PYTORCH_TRANSFORMERS_CACHE=/app/.cache/pytorch_transformers

# Expose the port
EXPOSE 8000

# Run the startup script
CMD ["./scripts/start.sh"] 