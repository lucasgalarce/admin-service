import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginationDto, RequestPaginationDto } from '../../../utils/dtos/Pagination.dto';
import { Task } from '../entity/task.entity';

export class TaskDto extends OmitType(Task, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
  'user',
] as const) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}

export class UpdateTaskDto extends PartialType(TaskDto) {}

export class TaskQueryDto extends RequestPaginationDto {
  @ApiProperty({ description: 'Title filter', required: false })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'User id', required: true })
  @IsString()
  user: string;
}

export class TaskPaginationDto extends PaginationDto<Task> {
  @ApiProperty({ type: Task, isArray: true })
  data: Task[];
}
