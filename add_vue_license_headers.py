#!/usr/bin/env python3
"""
Script to add GNU AGPL license headers to Vue.js files
Copyright (C) 2024 ChatterMate
"""

import os
import sys
from typing import List

LICENSE_HEADER = '''<!--
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
-->

'''

def find_vue_files(start_path: str) -> List[str]:
    """Find all Vue files in the given directory and its subdirectories."""
    vue_files = []
    for root, _, files in os.walk(start_path):
        for file in files:
            if file.endswith('.vue'):
                # Skip node_modules directory
                if 'node_modules' not in root:
                    vue_files.append(os.path.join(root, file))
    return vue_files

def get_file_description(file_path: str) -> str:
    """Generate a description for the file based on its path."""
    rel_path = os.path.relpath(file_path)
    parts = rel_path.split(os.sep)
    # Get the component name without .vue extension
    component_name = parts[-1].replace('.vue', '')
    # Split by camelCase and capitalize each word
    words = []
    current_word = ''
    for char in component_name:
        if char.isupper() and current_word:
            words.append(current_word)
            current_word = char
        else:
            current_word += char
    if current_word:
        words.append(current_word)
    
    return ' '.join(word.capitalize() for word in words)

def has_license_header(content: str) -> bool:
    """Check if the file already has a license header."""
    return "GNU Affero General Public License" in content

def add_license_header(file_path: str) -> None:
    """Add license header to a Vue file if it doesn't already have one."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if has_license_header(content):
        print(f"Skipping {file_path} - already has license header")
        return

    description = get_file_description(file_path)
    header = LICENSE_HEADER.format(file_description=description)
    
    # Remove any existing comment at the start of the file
    content = content.lstrip()
    if content.startswith('<!--'):
        content = content[content.find('-->') + 3:].lstrip()

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(header + content)
    print(f"Added license header to {file_path}")

def main():
    """Main function to process all Vue files."""
    # Start from the frontend directory
    start_path = 'frontend/src'
    if not os.path.exists(start_path):
        print(f"Error: {start_path} directory not found", file=sys.stderr)
        sys.exit(1)

    vue_files = find_vue_files(start_path)
    
    for file_path in vue_files:
        try:
            add_license_header(file_path)
        except Exception as e:
            print(f"Error processing {file_path}: {e}", file=sys.stderr)

if __name__ == '__main__':
    main() 