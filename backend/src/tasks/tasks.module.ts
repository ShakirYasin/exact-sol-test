import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { SocketService } from '../services/socket.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventLog, EventLogSchema } from '../schemas/event-log.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
    MongooseModule.forFeature([
      { name: EventLog.name, schema: EventLogSchema },
    ]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, SocketService],
  exports: [TasksService],
})
export class TasksModule {}
