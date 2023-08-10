import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { TaskError } from '../enum/task-error.enum';
import { UtilsService } from '../../../utils/services/utils.service';
import { Task } from '../entity/task.entity';
import { TaskRepository } from '../repository/task.repository';
import { TaskDto, TaskQueryDto, UpdateTaskDto } from '../dtos/task.dto';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class TaskService extends UtilsService<Task> {
  constructor(
    @Inject(TaskRepository) private readonly repository: TaskRepository,
    @Inject(UserService) private readonly userService: UserService,
  ) {
    super();
  }

  protected getRepository() {
    return this.repository;
  }

  async createTask(task: TaskDto, userId: string) {
    const taskDb = await this.findOneByFilter({ where: [{ title: task.title }] });
    if (taskDb) throw new ForbiddenException({ type: TaskError.TASK_TITLE_EXISTS });
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    const newTask = { ...task, user };
    super.create(newTask);
    return 'Task created';
  }

  async update(id: string, taskDto: UpdateTaskDto, userId: string) {
    if (!!taskDto.title && !!taskDto.description) {
      const taskDb = await this.findOneByFilter({
        where: [{ id }],
        relations: ['user'],
      });

      if (userId !== taskDb.user.id)
        throw new ForbiddenException({ type: TaskError.TASK_OWNER_DIFFERENT });
    }
    return this.updateById(id, taskDto);
  }

  public async deleteTask(id: string, userId) {
    const taskDb = await this.findOneByFilter({
      where: [{ id }],
      relations: ['user'],
    });

    if (!taskDb) throw new NotFoundException(`Task with id ${id} not found`);

    if (userId !== taskDb.user.id)
      throw new ForbiddenException({ type: TaskError.TASK_OWNER_DIFFERENT });

    return this.getRepository().softDelete(id);
  }

  async findWithFiltersAndPagination(payload: TaskQueryDto) {
    return this.getRepository().findTasksByFiltersPaginated(payload);
  }
}
