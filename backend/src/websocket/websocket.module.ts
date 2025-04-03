import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksGateway } from './tasks.gateway';
import { TasksModule } from '../tasks/tasks.module';
import { EventLog, EventLogSchema } from '../schemas/event-log.schema';

@Module({
  imports: [
    TasksModule,
    MongooseModule.forFeature([
      { name: EventLog.name, schema: EventLogSchema },
    ]),
  ],
  providers: [TasksGateway],
})
export class WebSocketModule {}
