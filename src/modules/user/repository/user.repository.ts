import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { PaginationDto } from '../../../utils/dtos/Pagination.dto';
import { UserQueryDto } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectRepository(User) private readonly _: Repository<User>) {
    super(_.target, _.manager, _.queryRunner);
  }

  findByUsername(username: string) {
    return this.createQueryBuilder('user')
      .andWhere('user.username = :username ', { username })
      .getOne();
  }

  async findUsersByFiltersPaginated(payload: UserQueryDto) {
    const { page, pageSize, username, role } = payload;

    const pageNumber = page ?? 0;
    const take = pageSize ?? 10;
    const skip = Math.max(0, pageNumber) * take;

    const query = this.createQueryBuilder('user');

    if (username) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('UPPER(user.username) LIKE UPPER(:username)', {
            username: `%${username}%`,
          });
        }),
      );
    }
    if (role) query.andWhere('user.role = :role', { role });
    query.leftJoinAndSelect('user.tasks', 'tasks');

    const [dataTest, total] = await query.take(take).skip(skip).getManyAndCount();
    const data = dataTest.map((user) => {
      const userPlain = classToPlain(user);
      delete userPlain['password'];
      delete userPlain['tempPassword'];
      return userPlain;
    });
    return new PaginationDto({
      data,
      page,
      pageSize: take,
      lastPage: total ? Math.ceil(total / take) - 1 : 0,
      total,
    });
  }

  async findByUsernameWithDeleteAt(username: string) {
    return this.createQueryBuilder('user')
      .withDeleted()
      .andWhere('user.username = :username ', { username })
      .getOne();
  }
}
