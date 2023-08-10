import { Module } from '@nestjs/common';
import { TaskController } from './controller/task.controller';
import { TaskService } from './service/task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { TaskRepository } from './repository/task.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule],
  providers: [TaskService, TaskRepository],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
