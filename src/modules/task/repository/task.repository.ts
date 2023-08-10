import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { Task } from '../entity/task.entity';
import { PaginationDto } from '../../../utils/dtos/Pagination.dto';
import { TaskQueryDto } from '../dtos/task.dto';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(@InjectRepository(Task) private readonly _: Repository<Task>) {
    super(_.target, _.manager, _.queryRunner);
  }

  async findTasksByFiltersPaginated(payload: TaskQueryDto) {
    const { page, pageSize, title } = payload;

    const pageNumber = page ?? 0;
    const take = pageSize ?? 10;
    const skip = Math.max(0, pageNumber) * take;

    const query = this.createQueryBuilder('task');

    if (title) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('UPPER(task.title) LIKE UPPER(:title)', { title: `%${title}%` });
        }),
      );
    }
    query.orderBy('task.title', 'ASC');

    const [data, total] = await query.take(take).skip(skip).getManyAndCount();

    return new PaginationDto({
      data,
      page,
      pageSize: take,
      lastPage: total ? Math.ceil(total / take) - 1 : 0,
      total,
    });
  }
}
