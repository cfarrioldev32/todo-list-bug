import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get('')
        listTasks(@CurrentUser() currentUser: JwtPayload) {
            return this.tasksService.listTasks(currentUser.id);
        }

    @Get(':id')
        getTask(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
            return this.tasksService.getTask(id, currentUser.id);
        }

    @Post('')
        createTask(
        @Body() createTaskDto: CreateTaskDto,
        @CurrentUser() user: JwtPayload,
        ) {
        return this.tasksService.createTask(createTaskDto, user.id);
        }

    @Patch(':id') 
        editTask(
        @Param('id') taskId: string,
        @Body() updateTaskDto: UpdateTaskDto,
        @CurrentUser() currentUser: JwtPayload,
        ) {
        return this.tasksService.editTask(taskId, updateTaskDto, currentUser.id);
        }


}
