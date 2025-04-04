import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { EventLog } from '../schemas/event-log.schema';
import { TaskEventData } from '../types';

@Injectable()
export class SocketService {
  private io: Server;

  constructor(
    @InjectModel(EventLog.name)
    private eventLogModel: Model<EventLog>,
  ) {}

  setSocketServer(server: Server) {
    this.io = server;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      socket.join(`tasks-room`);

      socket.on('disconnect', () => {
        socket.leave(`tasks-room`);
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  async logTaskEvent(eventData: TaskEventData) {
    try {
      await this.eventLogModel.create({
        type: `task_${eventData.action}`,
        userId: eventData.userId,
        metadata: eventData.metadata || {},
        description: `Task ${eventData.taskId} was ${eventData.action}`,
      });

      console.log('Task event logged:', eventData);

      this.io?.to(`tasks-room`).emit('TASK_UPDATED', {
        type: eventData.action,
        data: eventData,
      });
    } catch (error) {
      console.error('Failed to log task event:', error);
    }
  }
}
