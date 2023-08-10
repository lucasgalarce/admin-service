import { Module } from '@nestjs/common';
import { Initializer } from './services/initializer.service';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [Initializer],
  exports: [Initializer],
})
export class UtilsModule {}
