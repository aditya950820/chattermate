<!--
ChatterMate - Sidebar Toggle
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
defineProps<{
    isCollapsed: boolean
}>()

defineEmits<{
    (e: 'toggle'): void
}>()
</script>

<template>
    <button class="toggle-btn" @click="$emit('toggle')">
        <span class="toggle-icon">{{ isCollapsed ? '▶' : '◀' }}</span>
    </button>
</template>

<style scoped>
.toggle-btn {
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background: var(--primary-color);
    border: none;
    border-radius: 50%;
    color: var(--background-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-normal);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.toggle-btn:hover {
    background: var(--secondary-color);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.toggle-icon {
    font-size: 12px;
}
</style>