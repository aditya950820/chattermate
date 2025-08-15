<!--
ChatterMate - Group Form
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
import { ref } from 'vue'
import type { UserGroup } from '@/types/user'

const props = defineProps<{
  group?: UserGroup | null
}>()

const emit = defineEmits<{
  submit: [groupData: Partial<UserGroup>]
  cancel: []
}>()

const formData = ref({
  name: props.group?.name || '',
  description: props.group?.description || ''
})

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="group-form">
    <div class="form-group">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="form-input"
        rows="3"
      />
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary">
        {{ props.group ? 'Update' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.group-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-input {
  padding: var(--space-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-md);
}
</style> 