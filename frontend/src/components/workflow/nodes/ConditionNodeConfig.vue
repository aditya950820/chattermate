<!--
ChatterMate - Condition Node Configuration
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
import { computed } from 'vue'

interface ConditionNodeData {
  condition_expression: string
}

const props = defineProps<{
  modelValue: ConditionNodeData
  validationErrors: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: ConditionNodeData): void
  (e: 'validate-field', field: string): void
}>()

const formData = computed({
  get: () => props.modelValue,
  set: (value: ConditionNodeData) => emit('update:model-value', value)
})

// Update form data
const updateFormData = (field: keyof ConditionNodeData, value: any) => {
  formData.value = {
    ...formData.value,
    [field]: value
  }
  
  emit('validate-field', field)
}
</script>

<template>
  <div class="condition-node-config">
    <div class="form-group">
      <label for="condition-expression">Condition Expression *</label>
      <textarea
        id="condition-expression"
        :value="formData.condition_expression"
        @input="updateFormData('condition_expression', ($event.target as HTMLTextAreaElement).value)"
        @blur="$emit('validate-field', 'condition_expression')"
        class="form-textarea"
        :class="{ 'error': validationErrors.condition_expression }"
        placeholder="Enter condition logic (e.g., user_input.includes('yes'))"
        rows="4"
        required
      ></textarea>
      <div v-if="validationErrors.condition_expression" class="error-message">
        {{ validationErrors.condition_expression }}
      </div>
      <p class="help-text">
        Write JavaScript-style expressions to evaluate user input. Examples:<br>
        • <code>user_input.includes('yes')</code><br>
        • <code>user_input.toLowerCase() === 'help'</code><br>
        • <code>user_input.length > 10</code>
      </p>
    </div>
  </div>
</template>

<style scoped>
.condition-node-config {
  width: 100%;
}

.form-group {
  margin-bottom: var(--space-sm);
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
}

.form-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--background-color);
  color: var(--text-color);
  font-size: 0.85rem;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 70px;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(243, 70, 17, 0.1);
}

.form-textarea.error {
  border-color: var(--error-color);
  background-color: rgba(239, 68, 68, 0.05);
}

.form-textarea.error:focus {
  border-color: var(--error-color);
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

.help-text {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
  line-height: 1.3;
}

.help-text code {
  background: var(--background-soft);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.error-message {
  color: var(--error-color);
  font-size: 0.75rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-message::before {
  content: "⚠";
  font-size: 0.8rem;
}
</style> 