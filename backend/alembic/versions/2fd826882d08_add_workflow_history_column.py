"""add_workflow_history_column

Revision ID: 2fd826882d08
Revises: 0ee9dbc73d9e
Create Date: 2025-07-24 21:10:23.798939

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2fd826882d08'
down_revision: Union[str, None] = '0ee9dbc73d9e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add workflow_history column to store form submissions and workflow interactions
    op.add_column('session_to_agents', sa.Column('workflow_history', sa.JSON(), nullable=True))


def downgrade() -> None:
    # Remove workflow_history column
    op.drop_column('session_to_agents', 'workflow_history')
