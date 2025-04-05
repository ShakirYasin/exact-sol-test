import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(JwtGuard, AdminGuard)
  async findAll() {
    return this.eventsService.findAll();
  }
}
