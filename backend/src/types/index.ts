import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

export interface TaskEventData {
  taskId: string;
  userId: string;
  action: 'created' | 'updated' | 'deleted' | 'assigned';
  metadata?: Record<string, any>;
}
