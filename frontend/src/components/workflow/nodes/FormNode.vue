<!--
ChatterMate - Form Node Component
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

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { Node } from '@vue-flow/core'

defineProps<{
  data: Node['data']
}>()
</script>

<template>
  <div class="form-node">
    <Handle
      id="input"
      type="target"
      :position="Position.Left"
      class="node-handle"
    />
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-icon">📝</div>
        <div class="node-title">{{ data.label || 'Form' }}</div>
      </div>
      
      <div v-if="data.description" class="node-description">
        {{ data.description }}
      </div>
      
      <div v-if="data.config?.fields?.length" class="node-preview">
        <div class="preview-label">Fields ({{ data.config.fields.length }}):</div>
        <div class="field-list">
          <div
            v-for="field in data.config.fields.slice(0, 3)"
            :key="field.name"
            class="field-item"
          >
            {{ field.name }} ({{ field.type }})
          </div>
          <div v-if="data.config.fields.length > 3" class="field-more">
            +{{ data.config.fields.length - 3 }} more
          </div>
        </div>
      </div>
    </div>
    
    <Handle
      id="output"
      type="source"
      :position="Position.Right"
      class="node-handle"
    />
  </div>
</template>

<style scoped>
.form-node {
  position: relative;
  background: var(--background-color);
  border: 2px solid #10B981;
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  min-width: 200px;
  max-width: 300px;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.form-node:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.node-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.node-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.node-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: var(--text-sm);
}

.node-description {
  color: var(--text-muted);
  font-size: 0.75rem;
  line-height: 1.3;
}

.node-preview {
  background: var(--background-soft);
  border-radius: var(--radius-sm);
  padding: var(--space-sm);
  border: 1px solid var(--border-color);
}

.preview-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 4px;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.field-item {
  font-size: 0.65rem;
  color: var(--text-color);
  padding: 2px 4px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 3px;
}

.field-more {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-style: italic;
}

.node-handle {
  background: #10B981;
  border: 2px solid var(--background-color);
  width: 12px;
  height: 12px;
}

.node-handle:hover {
  background: #059669;
  transform: scale(1.2);
}
</style> 