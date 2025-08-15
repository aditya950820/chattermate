<!--
ChatterMate - Role Form
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
import { ref, onMounted, watch } from 'vue'
import type { Role } from '@/types/user'
import { listPermissions, type Permission } from '@/services/roles'

const props = defineProps<{
  role?: Role | null
}>()

const emit = defineEmits<{
  submit: [roleData: Partial<Role>]
  cancel: []
}>()

const name = ref('')
const description = ref('')
const selectedPermissions = ref<Permission[]>([])
const permissions = ref<Permission[]>([])
const loading = ref(false)
const error = ref('')

// Watch for role prop changes to update form
watch(() => props.role, (newRole) => {
  name.value = newRole?.name || ''
  description.value = newRole?.description || ''
  selectedPermissions.value = newRole?.permissions || []
}, { immediate: true })

const fetchPermissions = async () => {
  try {
    loading.value = true
    permissions.value = await listPermissions()
  } catch (err) {
    console.error('Failed to load permissions:', err)
    error.value = 'Failed to load permissions'
  } finally {
    loading.value = false
  }
}

const handleSubmit = () => {
  if (!selectedPermissions.value.length) {
    error.value = 'Please select at least one permission'
    return
  }

  emit('submit', {
    name: name.value,
    description: description.value,
    is_default: false,
    permissions: selectedPermissions.value
  })

  // Reset form if not editing
  if (!props.role) {
    name.value = ''
    description.value = ''
    selectedPermissions.value = []
    error.value = ''
  }
}

onMounted(fetchPermissions)
</script>

<template>
  <form @submit.prevent="handleSubmit" class="role-form">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="form-group">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="name"
        type="text"
        required
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="description"
        class="form-input"
        rows="3"
      />
    </div>

    <div class="form-group">
      <label>Permissions</label>
      <div v-if="loading" class="loading">Loading permissions...</div>
      <div v-else class="permissions-list">
        <label 
          v-for="permission in permissions" 
          :key="permission.id"
          class="permission-item"
        >
          <input
            type="checkbox"
            :checked="selectedPermissions.map(p => p.id).includes(permission.id)"
            @change="($event) => {
              if (($event.target as HTMLInputElement).checked) {
                selectedPermissions.push(permission)
              } else {
                selectedPermissions = selectedPermissions.filter(p => p.id !== permission.id)
              }
            }"
          />
          <div class="permission-info">
            <span class="permission-name">{{ permission.name }}</span>
            <span v-if="permission.description" class="permission-description">
              {{ permission.description }}
            </span>
          </div>
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="btn btn-primary">
        {{ props.role ? 'Update' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.role-form {
  padding: var(--space-lg);
  background-color: var(--background-dark);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-input {
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.permissions-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: var(--space-sm);
}

.permission-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm);
  cursor: pointer;
}

.permission-info {
  display: flex;
  flex-direction: column;
}

.permission-name {
  font-weight: 500;
}

.permission-description {
  font-size: var(--text-sm);
  color: var(--text-color);
  opacity: 0.7;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.error-message {
  color: var(--error-color);
  margin-bottom: var(--space-md);
}

.loading {
  text-align: center;
  padding: var(--space-lg);
  color: var(--text-color);
  opacity: 0.7;
}
</style> 