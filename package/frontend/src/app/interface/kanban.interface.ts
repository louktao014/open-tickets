export type KanbanPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type KanbanColumnId =
  | 'todo'
  | 'in-progress'
  | 'ready-to-test'
  | 'test-in-progress'
  | 'test-fail'
  | 'done';

export interface KanbanMeta {
  icon: string;
  label: string;
}

export interface KanbanTicket {
  id: string;
  title: string;
  priority: KanbanPriority;
  meta: KanbanMeta[];
  assigneeAvatarUrl: string;
  assigneeAlt: string;
  alert?: string;
  detail?: string;
  createDate?: string;
  updateDate?: string;
  taskType?: string;
  jobType?: string;
}

export interface KanbanColumn {
  id: KanbanColumnId;
  name: string;
  count: number;
  tickets: KanbanTicket[];
}
