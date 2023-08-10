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

  async create(task: TaskDto) {
    const taskDb = await this.findOneByFilter({ where: [{ title: task.title }] });
    if (taskDb) throw new ForbiddenException({ type: TaskError.TASK_TITLE_EXISTS });
    const user = await this.userService.findById(task.userId);
    if (!user) {
      throw new NotFoundException(`User #${task.userId} not found`);
    }

    const newTask = { ...task, user };

    return super.create(newTask);
  }

  async update(id: string, taskDto: UpdateTaskDto) {
    if (!!taskDto.title) {
      const taskDb = await this.findOneByFilter({ where: [{ title: taskDto.title }] });
      if (taskDb && taskDb.id != id)
        throw new ForbiddenException({ type: TaskError.TASK_TITLE_EXISTS });
    }
    return this.updateById(id, taskDto);
  }

  async findWithFiltersAndPagination(payload: TaskQueryDto) {
    return this.getRepository().findTasksByFiltersPaginated(payload);
  }
}
