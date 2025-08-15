<!--
ChatterMate - Condition Node Component
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
  <div class="condition-node">
    <Handle
      id="input"
      type="target"
      :position="Position.Left"
      class="node-handle"
    />
    
    <div class="node-content">
      <div class="node-header">
        <div class="node-icon">🔀</div>
        <div class="node-title">{{ data.label || 'Condition' }}</div>
      </div>
      
      <div v-if="data.description" class="node-description">
        {{ data.description }}
      </div>
      
      <div v-if="data.config?.condition" class="node-preview">
        <div class="preview-label">Condition:</div>
        <div class="preview-content">
          {{ data.config.condition.substring(0, 80) }}{{ data.config.condition.length > 80 ? '...' : '' }}
        </div>
      </div>
    </div>
    
    <Handle
      id="true"
      type="source"
      :position="Position.Right"
      :style="{ top: '30%' }"
      class="node-handle true-handle"
    />
    <div class="handle-label true-label">True</div>
    
    <Handle
      id="false"
      type="source"
      :position="Position.Right"
      :style="{ top: '70%' }"
      class="node-handle false-handle"
    />
    <div class="handle-label false-label">False</div>
  </div>
</template>

<style scoped>
.condition-node {
  position: relative;
  background: var(--background-color);
  border: 2px solid #F59E0B;
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  min-width: 200px;
  max-width: 300px;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.condition-node:hover {
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
  margin-bottom: 2px;
}

.preview-content {
  font-size: 0.7rem;
  color: var(--text-color);
  line-height: 1.3;
}

.node-handle {
  background: #F59E0B;
  border: 2px solid var(--background-color);
  width: 12px;
  height: 12px;
}

.node-handle.true-handle {
  background: #10B981;
}

.node-handle.false-handle {
  background: #EF4444;
}

.node-handle:hover {
  transform: scale(1.2);
}

.handle-label {
  position: absolute;
  right: -35px;
  font-size: 0.6rem;
  color: var(--text-muted);
  font-weight: 500;
  pointer-events: none;
}

.true-label {
  top: 25%;
  color: #10B981;
}

.false-label {
  top: 65%;
  color: #EF4444;
}
</style> 