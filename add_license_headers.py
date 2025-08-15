#!/usr/bin/env python3
"""
Script to add GNU AGPL license headers to Python files
Copyright (C) 2024 ChatterMate
"""

import os
import sys
from typing import List

LICENSE_HEADER = '''"""
ChatterMate - {file_description}
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

'''

def find_python_files(start_path: str) -> List[str]:
    """Find all Python files in the given directory and its subdirectories."""
    python_files = []
    for root, _, files in os.walk(start_path):
        for file in files:
            if file.endswith('.py'):
                python_files.append(os.path.join(root, file))
    return python_files

def get_file_description(file_path: str) -> str:
    """Generate a description for the file based on its path."""
    rel_path = os.path.relpath(file_path)
    parts = rel_path.split(os.sep)
    if 'tests' in parts:
        return f"{' '.join(p.title() for p in parts[-1].replace('.py', '').split('_'))}"
    else:
        return f"{' '.join(p.title() for p in parts[-1].replace('.py', '').split('_'))}"

def has_license_header(content: str) -> bool:
    """Check if the file already has a license header."""
    return "GNU Affero General Public License" in content

def add_license_header(file_path: str) -> None:
    """Add license header to a Python file if it doesn't already have one."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if has_license_header(content):
        print(f"Skipping {file_path} - already has license header")
        return

    description = get_file_description(file_path)
    header = LICENSE_HEADER.format(file_description=description)
    
    # Remove any existing docstring at the start of the file
    if content.lstrip().startswith('"""'):
        content = content[content.find('"""', content.find('"""') + 3) + 3:].lstrip()
    elif content.lstrip().startswith("'''"):
        content = content[content.find("'''", content.find("'''") + 3) + 3:].lstrip()

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(header + content)
    print(f"Added license header to {file_path}")

def main():
    """Main function to process all Python files."""
    start_path = '.'  # Current directory
    python_files = find_python_files(start_path)
    
    for file_path in python_files:
        try:
            add_license_header(file_path)
        except Exception as e:
            print(f"Error processing {file_path}: {e}", file=sys.stderr)

if __name__ == '__main__':
    main() 