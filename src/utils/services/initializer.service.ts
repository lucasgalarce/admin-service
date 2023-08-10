import { Injectable, OnModuleInit, Inject } from '@nestjs/common';

import { UserService } from '../../modules/user/service/user.service';
import { UserDto } from '../../modules/user/dto/user.dto';
import { Role } from '../enum/role.enum';

@Injectable()
export class Initializer implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    await this.initialConfig();
  }

  async initialConfig() {
    const users = await this.userService.findAll();

    if (users.length === 0) {
      const firstAdmin: UserDto = {
        username: 'admin',
        name: 'super admin',
        email: 'admin@test.com',
        password: 'Admin2121!',
        role: Role.ADMIN,
        enabled: true,
      };

      await this.userService.create(firstAdmin);
    }
  }
}
