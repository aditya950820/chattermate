"""change datetime to timestamp with timezone

Revision ID: 89a4f4898aa4
Revises: 91a148726029
Create Date: 2024-03-21 19:18:36.159906

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '89a4f4898aa4'
down_revision: Union[str, None] = '91a148726029'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Change columns from DateTime to TIMESTAMP WITH TIME ZONE in chat_history table
    op.alter_column('chat_history', 'created_at',
               existing_type=sa.DateTime(),
               type_=sa.TIMESTAMP(timezone=True),
               existing_nullable=True,
               existing_server_default=sa.text('now()'))
    
    op.alter_column('chat_history', 'updated_at',
               existing_type=sa.DateTime(),
               type_=sa.TIMESTAMP(timezone=True),
               existing_nullable=True,
               existing_server_default=sa.text('now()'))


def downgrade() -> None:
    # Change columns back to DateTime in chat_history table
    op.alter_column('chat_history', 'created_at',
               existing_type=sa.TIMESTAMP(timezone=True),
               type_=sa.DateTime(),
               existing_nullable=True,
               existing_server_default=sa.text('now()'))
    
    op.alter_column('chat_history', 'updated_at',
               existing_type=sa.TIMESTAMP(timezone=True),
               type_=sa.DateTime(),
               existing_nullable=True,
               existing_server_default=sa.text('now()'))
