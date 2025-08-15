<!--
ChatterMate - User Group Form
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
import { ref, onMounted } from 'vue'
import type { User } from '@/types/user'
import { listGroups } from '@/services/groups'
import type { UserGroup } from '@/types/user'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  close: []
  groupToggle: [groupId: string, checked: boolean]
}>()

const groups = ref<UserGroup[]>([])
const loading = ref(false)
const selectedGroups = ref<string[]>(props.user.groups?.map(g => g.id) || [])

const fetchGroups = async () => {
  try {
    loading.value = true
    groups.value = await listGroups()
  } catch (err) {
    console.error('Failed to load groups:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchGroups)
</script>

<template>
  <div class="groups-form">
    <div v-if="loading" class="loading">Loading groups...</div>
    <div v-else class="groups-list">
      <div v-for="group in groups" :key="group.id" class="group-item">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="selectedGroups.includes(group.id)"
            @change="$emit('groupToggle', group.id, ($event.target as HTMLInputElement).checked)"
            :disabled="loading"
          />
          <div class="group-info">
            <span class="group-name">{{ group.name }}</span>
            <span v-if="group.description" class="group-description">{{ group.description }}</span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.groups-form {
  padding: var(--space-md);
}

.groups-list {
  max-height: 400px;
  overflow-y: auto;
}

.group-item {
  padding: var(--space-sm);
  border-bottom: 1px solid var(--border-color);
}

.group-item:last-child {
  border-bottom: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
}

.group-info {
  display: flex;
  flex-direction: column;
}

.group-name {
  font-weight: 500;
}

.group-description {
  font-size: var(--text-sm);
  opacity: 0.7;
}

.loading {
  text-align: center;
  padding: var(--space-xl);
  opacity: 0.7;
}
</style> 