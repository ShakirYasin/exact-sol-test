import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventLog } from '../schemas/event-log.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventLog.name) private readonly eventLogModel: Model<EventLog>,
  ) {}

  async findAll() {
    return this.eventLogModel.find().sort({ createdAt: -1 }).exec();
  }
}
