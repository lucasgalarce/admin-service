import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from '@nestjs/class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { EntityBase } from '../../../utils/entity/entity-base';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Task extends EntityBase {
  @ApiProperty({
    description: 'Title name',
    type: String,
  })
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty({
    description: 'description',
    required: false,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'status',
    required: false,
  })
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  status: string;

  @ManyToOne(() => User, (user: User) => user.tasks)
  user: User;
}
