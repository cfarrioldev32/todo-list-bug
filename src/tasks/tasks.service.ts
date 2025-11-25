import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks(userId: string) {
        const tasks = await this.tasksRepository.find({
            where: {owner: {id: userId}}
        });
        //TODO: Implement logs
        return tasks;
    }

    async getTask(taskId: string, userId: string) {
        const task = await this.tasksRepository.findOne({
            where: { id: taskId, owner: {id: userId} },
            relations: ['owner'],
            select: {
                owner: {
                    id: true
                }
            }
        },
        );
        
        if(!task) {
           throw new NotFoundException('Task not found');
        }
        return task;
    }

    async editTask(taskId: string, updateTaskDto: UpdateTaskDto, userId: string) {
        const task = await this.getTask(taskId, userId);

        Object.assign(task, updateTaskDto);

        const editedTask = await this.tasksRepository.save(task);

        //TODO: Implement logs
        return editedTask;
     }
}
