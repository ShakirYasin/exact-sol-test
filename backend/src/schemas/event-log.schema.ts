import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum EventType {
  TASK_CREATED = 'task_created',
  TASK_UPDATED = 'task_updated',
  TASK_DELETED = 'task_deleted',
  TASK_ASSIGNED = 'task_assigned',
  USER_LOGGED_IN = 'user_logged_in',
  USER_LOGGED_OUT = 'user_logged_out',
}

@Schema({ timestamps: true })
export class EventLog extends Document {
  @Prop({ required: true, enum: EventType })
  type: EventType;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  description: string;
}

export const EventLogSchema = SchemaFactory.createForClass(EventLog);
