import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from '../tasks/tasks.service';
import { EventLog, EventType } from '../schemas/event-log.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
})
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private tasksService: TasksService,
    @InjectModel(EventLog.name)
    private eventLogModel: Model<EventLog>,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinTaskRoom')
  async handleJoinTaskRoom(client: Socket, taskId: string) {
    client.join(`task:${taskId}`);
  }

  @SubscribeMessage('leaveTaskRoom')
  async handleLeaveTaskRoom(client: Socket, taskId: string) {
    client.leave(`task:${taskId}`);
  }

  async emitTaskUpdate(taskId: string, eventType: EventType, data: any) {
    this.server.to(`task:${taskId}`).emit('taskUpdate', {
      type: eventType,
      data,
    });

    // Log the event to MongoDB
    await this.eventLogModel.create({
      type: eventType,
      userId: data.userId,
      metadata: data,
      description: `Task ${taskId} ${eventType}`,
    });
  }
}
