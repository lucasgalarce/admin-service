import { Module } from '@nestjs/common';
import { PostgresProvider } from './postgres.provider';

@Module({
  imports: [PostgresProvider],
  exports: [PostgresProvider],
})
export class PostgresModule {}
