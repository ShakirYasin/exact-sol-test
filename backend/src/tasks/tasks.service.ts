import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { SocketService } from '../services/socket.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private socketService: SocketService,
  ) {}

  async create(createTaskDto: Partial<Task>, userId: string): Promise<Task> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      assignedTo: user,
      createdBy: user,
    });

    const savedTask = await this.taskRepository.save(task);

    await this.socketService.logTaskEvent({
      taskId: savedTask.id,
      userId,
      action: 'created',
      metadata: { task: savedTask },
    });

    return savedTask;
  }

  async findAll(
    userId: string,
    filters?: { status?: string },
  ): Promise<Task[]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .leftJoinAndSelect('task.createdBy', 'createdBy');

    if (filters?.status) {
      if (!Object.values(TaskStatus).includes(filters.status as TaskStatus)) {
        throw new BadRequestException('Invalid task status');
      }
      query.andWhere('task.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: Partial<Task>,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);

    if (updateTaskDto.status) {
      if (!Object.values(TaskStatus).includes(updateTaskDto.status)) {
        throw new BadRequestException('Invalid task status');
      }
    }

    Object.assign(task, updateTaskDto);
    const updatedTask = await this.taskRepository.save(task);

    await this.socketService.logTaskEvent({
      taskId: updatedTask.id,
      userId,
      action: 'updated',
      metadata: { task: updatedTask },
    });

    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);

    await this.socketService.logTaskEvent({
      taskId: id,
      userId,
      action: 'deleted',
      metadata: { taskId: id },
    });
  }

  async assignTask(
    taskId: string,
    userId: string,
    assigneeId: string,
  ): Promise<Task> {
    const task = await this.findOne(taskId, userId);
    const assignee = await this.userRepository.findOne({
      where: { id: assigneeId },
    });

    if (!assignee) {
      throw new NotFoundException('Assignee not found');
    }

    task.assignedTo = assignee;
    const updatedTask = await this.taskRepository.save(task);

    await this.socketService.logTaskEvent({
      taskId: updatedTask.id,
      userId,
      action: 'assigned',
      metadata: { task: updatedTask, assigneeId },
    });

    return updatedTask;
  }
}
