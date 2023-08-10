import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { IdParams } from '../../../utils/dtos/Commons.dto';
import {
  UpdateUserDto,
  UserDto,
  UserPaginationDto,
  UserQueryDto,
  UpdateUserStatusDto,
} from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { User } from '../entity/user.entity';
import { Roles } from '../../../utils/decorator/role.decorator';
import { Role } from '../../../utils/enum/role.enum';
import { TransformClassToPlain } from '@nestjs/class-transformer';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guard/role.guard';

@Controller('/users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(TransformClassToPlain)
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  getService(): UserService {
    return this.userService;
  }

  @Get('/')
  @Roles(Role.ADMIN)
  @ApiOkResponse({ type: UserPaginationDto })
  async findAll(@Query() query: UserQueryDto) {
    return this.getService().findWithFiltersAndPagination(query);
  }

  @Get('/:id')
  @Roles(Role.ADMIN)
  @ApiOkResponse({ type: User, description: 'User detail' })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param() params: IdParams) {
    return this.getService().findById(params.id);
  }

  @Post('/')
  @ApiBody({ type: UserDto, required: true })
  @ApiCreatedResponse({ type: UserDto, description: 'User created' })
  async save(@Body() entity: UserDto): Promise<string> {
    await this.getService().create(entity);
    return 'User created';
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'The user you want to delete does not exist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: IdParams) {
    await this.getService().deleteUser(params.id);
  }

  @Put('/:id')
  @Roles(Role.ADMIN)
  @ApiNoContentResponse({ description: 'User updated' })
  @ApiNotFoundResponse({ description: 'The user you want to update does not exist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param() params: IdParams, @Body() entity: UpdateUserDto) {
    await this.getService().update(params.id, entity);
  }
}
