import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TaskService } from '../service/task.service';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from '../entity/task.entity';
import { IdParams } from '../../../utils/dtos/Commons.dto';
import { TaskDto, TaskPaginationDto, UpdateTaskDto } from '../dtos/task.dto';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guard/role.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from 'src/modules/user/entity/user.entity';
@Controller('tasks')
@ApiTags('Tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private service: TaskService) {}

  taskService(): TaskService {
    return this.service;
  }

  @Get('/')
  @ApiOkResponse({ type: TaskPaginationDto })
  async findAll() {
    const tasks = await this.taskService().findAll();
    return tasks;
  }

  @Get('/:id')
  @ApiOkResponse({ type: Task, description: 'Task detail' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  findOne(@Param() params: IdParams) {
    return this.taskService().findByIdOrFail(params.id);
  }

  @Post('/')
  @ApiBody({ type: TaskDto, required: true })
  @ApiCreatedResponse({ description: 'Task created' })
  async save(@Body() entity: TaskDto, @CurrentUser() user: User) {
    return this.taskService().createTask(entity, user.id);
  }

  @Delete('/:id')
  @ApiNoContentResponse({ description: 'Task deleted' })
  @ApiNotFoundResponse({ description: 'The Task you want to delete does not exist' })
  async delete(@Param() params: IdParams, @CurrentUser() user: User) {
    await this.taskService().deleteTask(params.id, user.id);
  }

  @Put('/:id')
  @ApiNoContentResponse({ description: 'Task updated' })
  @ApiNotFoundResponse({ description: 'The Task you want to update does not exist' })
  async update(
    @Param() params: IdParams,
    @Body() entity: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    await this.taskService().update(params.id, entity, user.id);
  }
}
