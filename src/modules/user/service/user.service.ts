import * as bcrypt from 'bcrypt';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { UtilsService } from '../../../utils/services/utils.service';
import { User } from '../entity/user.entity';
import { UpdateUserDto, UserDto, UserQueryDto } from '../dto/user.dto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService extends UtilsService<User> {
  constructor(@Inject(UserRepository) private readonly repository: UserRepository) {
    super();
  }

  protected getRepository() {
    return this.repository;
  }

  async create(user: UserDto) {
    const userDb = await this.findOneByFilter({
      where: [{ username: user.username }, { email: user.email }],
    });
    if (userDb) throw new ForbiddenException(`User already exists`);

    const createdUser = await super.create(user);
    return createdUser;
  }

  findByUsername(username: string) {
    return this.getRepository().findByUsername(username);
  }

  findByUsernameWithDeleteAt(username: string) {
    return this.getRepository().findByUsernameWithDeleteAt(username);
  }

  async update(id: string, userDto: UpdateUserDto) {
    if (userDto.email) await this.checkEmailExists(id, userDto.email);
    return this.updateById(id, userDto);
  }

  async deleteUser(id: string) {
    return this.deleteOrFail(id);
  }

  async findWithFiltersAndPagination(payload: UserQueryDto) {
    return this.getRepository().findUsersByFiltersPaginated(payload);
  }

  async checkEmailExists(userId: string, email: string) {
    const userDB = await this.findById(userId);
    if (userDB?.email !== email) {
      const emailExists = await this.findOneByFilter({ where: { email: email } });
      if (emailExists) throw new ForbiddenException(`Email already in use`);
    }
  }
}
