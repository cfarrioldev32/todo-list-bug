import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';

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
        //TODO: Implement logs
        return task;
    }

    async editTask(body: any, userId: string) {
        await this.tasksRepository.update(body.id, body);

        const editedTask = await this.getTask(body.id, userId);

        return editedTask;
    }
}
