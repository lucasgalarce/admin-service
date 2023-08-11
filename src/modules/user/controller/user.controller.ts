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
import { UpdateUserDto, UserDto, UserPaginationDto, UserQueryDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import { User } from '../entity/user.entity';
import { TransformClassToPlain } from '@nestjs/class-transformer';
import { JwtAuthGuard } from 'src/modules/auth/guard/jwt.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';

@Controller('/users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(TransformClassToPlain)
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  getService(): UserService {
    return this.userService;
  }

  @Get('/')
  @ApiOkResponse({ type: UserPaginationDto })
  async findAll(@Query() query: UserQueryDto, @CurrentUser() user: User) {
    return this.getService().findWithFiltersAndPagination(query);
  }

  @Get('/:id')
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
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'The user you want to delete does not exist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() params: IdParams) {
    await this.getService().deleteUser(params.id);
  }

  @Put('/:id')
  @ApiNoContentResponse({ description: 'User updated' })
  @ApiNotFoundResponse({ description: 'The user you want to update does not exist' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param() params: IdParams, @Body() entity: UpdateUserDto) {
    await this.getService().update(params.id, entity);
  }
}
