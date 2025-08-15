<!--
ChatterMate - 403
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

<template>
  <DashboardLayout>
    <div class="unauthorized">
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      <router-link to="/" class="back-link">
        Return to Dashboard
      </router-link>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.unauthorized {
  padding: var(--space-xl);
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-top: var(--space-lg);
  color: var(--primary-color);
  text-decoration: none;
}
</style> 