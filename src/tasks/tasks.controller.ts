import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get('')
    async listTasks(@CurrentUser() currentUser: JwtPayload) {
        return this.tasksService.listTasks(currentUser.id);
    }

    @Get('/:id')
    async getTask(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
        return this.tasksService.getTask(id, currentUser.id);
    }

    @Post('/edit')
    async editTask(@Body() body, @CurrentUser() currentUser: JwtPayload) {
        return this.tasksService.editTask(body, currentUser.id);
    }
}
