/**
 * ChatterMate - Workflow Types
 * Copyright (C) 2024 ChatterMate
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 */

export enum WorkflowStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum ExitCondition {
  SINGLE_EXECUTION = 'single_execution',
  CONTINUOUS_EXECUTION = 'continuous_execution'
}

export interface WorkflowCreate {
  name: string
  description?: string
  agent_id: string
}

export interface WorkflowResponse {
  id: string
  name: string
  description?: string
  agent_id: string
  organization_id: string
  status: WorkflowStatus
  created_at: string
  updated_at: string
}

export interface WorkflowNode {
  id: string
  workflow_id: string
  node_type: string
  name: string
  description?: string
  position_x: number
  position_y: number
  config: Record<string, any>
  created_at: string
  updated_at: string
}

export interface WorkflowConnection {
  id: string
  workflow_id: string
  source_node_id: string
  target_node_id: string
  source_handle?: string
  target_handle?: string
  label?: string
  condition?: string
  priority: number
  connection_metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface WorkflowNodesResponse {
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
} 