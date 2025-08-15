"""add_progress_tracking_to_knowledge_queue

Revision ID: dc827ab30bd4
Revises: 621095beb234
Create Date: 2025-08-05 16:28:47.201062

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dc827ab30bd4'
down_revision: Union[str, None] = '621095beb234'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new progress tracking columns to knowledge_queue table
    op.add_column('knowledge_queue', sa.Column('processing_stage', sa.String(), nullable=True, server_default='not_started'))
    op.add_column('knowledge_queue', sa.Column('progress_percentage', sa.Float(), nullable=True, server_default='0.0'))
    op.add_column('knowledge_queue', sa.Column('total_items', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('knowledge_queue', sa.Column('processed_items', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('knowledge_queue', sa.Column('crawled_urls', sa.JSON(), nullable=True))


def downgrade() -> None:
    # Remove the progress tracking columns
    op.drop_column('knowledge_queue', 'crawled_urls')
    op.drop_column('knowledge_queue', 'processing_stage')
    op.drop_column('knowledge_queue', 'progress_percentage')
    op.drop_column('knowledge_queue', 'total_items')
    op.drop_column('knowledge_queue', 'processed_items')
