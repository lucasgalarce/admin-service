import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresModule } from './database/postgres/postgres.module';
import { config, environments, validationSchema } from './config';
import { UtilsModule } from './utils/utils.module';

import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[`${process.env.NODE_ENV}`],
      ignoreEnvFile: process.env.NODE_ENV === 'production' || false,
      load: [config],
      isGlobal: true,
      validationSchema,
    }),
    PostgresModule,
    UtilsModule,
    UserModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
