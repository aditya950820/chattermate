"""merge heads

Revision ID: 85364d188f15
Revises: 0cf5fa1db0cb, 89a4f4898aa4
Create Date: 2025-03-22 20:43:28.206404

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '85364d188f15'
down_revision: Union[str, None] = ('0cf5fa1db0cb', '89a4f4898aa4')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
