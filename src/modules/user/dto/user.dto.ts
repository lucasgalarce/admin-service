import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { User } from '../entity/user.entity';
import { Role } from '../../../utils/enum/role.enum';
import { PaginationDto, RequestPaginationDto } from '../../../utils/dtos/Pagination.dto';

export class UserDto extends OmitType(User, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
] as const) {}

export class UpdateUserDto extends PartialType(PickType(User, ['password', 'name', 'email'])) {}

export class UpdateUserStatusDto extends PartialType(PickType(User, ['enabled'])) {}

export class UserQueryDto extends RequestPaginationDto {
  @ApiProperty({ description: 'Role filter', required: false, enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    description: 'Username filter',
    required: false,
    example: 'John',
  })
  @IsString()
  @IsOptional()
  username?: string;
}

export class UserPaginationDto extends PaginationDto<User> {
  @ApiProperty({ type: User, isArray: true })
  data: User[];
}
