import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: Partial<Task>, userId: string): Promise<Task> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      assignedTo: user,
    });

    return this.taskRepository.save(task);
  }

  async findAll(
    userId: string,
    filters?: { status?: string },
  ): Promise<Task[]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'user')
      .where('user.id = :userId', { userId });

    if (filters?.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'user')
      .where('task.id = :id', { id })
      .andWhere('user.id = :userId', { userId })
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
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
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
    return this.taskRepository.save(task);
  }
}
