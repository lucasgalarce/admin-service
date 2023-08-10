import * as bcrypt from 'bcrypt';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { Task } from 'src/modules/task/entity/task.entity';
import { EntityBase } from '../../../utils/entity/entity-base';
import { Role } from '../../../utils/enum/role.enum';

@Entity()
export class User extends EntityBase {
  @ApiProperty({
    description: 'Email of User',
    required: true,
    default: 'email@user.com',
  })
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'email not valid' })
  email!: string;

  @ApiProperty({
    description: 'Username of User',
    required: true,
    default: 'john.doe',
  })
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'First name of User',
    required: true,
    example: 'John',
  })
  @Column({ default: '' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Password of User',
    required: true,
    default: 'pwd_user',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @ApiProperty({
    description: 'Role of User',
    required: false,
  })
  @Column({ type: 'simple-enum', enum: Role })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    description: 'Enabled status of of User',
    required: true,
  })
  @Column('boolean', { default: true })
  @IsBoolean()
  enabled = true;

  @OneToMany(() => Task, (task: Task) => task.user)
  tasks?: Task[];

  @Column({ nullable: true })
  lastActiveAt?: Date;

  @Exclude({ toPlainOnly: true })
  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  private async hashPasswordOnInsert(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  private setDefaultEnabledValue(): void {
    if (this.enabled === undefined) {
      this.enabled = false;
    }
  }

  @BeforeUpdate()
  private async hashPasswordOnUpdate(): Promise<void> {
    if (this.tempPassword !== this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
