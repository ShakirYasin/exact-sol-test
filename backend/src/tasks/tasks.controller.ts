import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';
import { JwtGuard } from '../auth/jwt.guard';
import { RequestWithUser } from 'src/types';
@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: Partial<Task>,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req: RequestWithUser, @Query('status') status?: string) {
    return this.tasksService.findAll(req.user.userId, { status });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: Partial<Task>,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.tasksService.remove(id, req.user.userId);
  }

  @Post(':id/assign')
  assignTask(
    @Param('id') id: string,
    @Body('assigneeId') assigneeId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.tasksService.assignTask(id, req.user.userId, assigneeId);
  }
}
