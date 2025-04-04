export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export type TaskStatusType = `${TaskStatus}` | 'all'; 

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
}

export interface TaskEventData {
  taskId: string;
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'assigned';
  metadata?: Record<string, unknown>;
}