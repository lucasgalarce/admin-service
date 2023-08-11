import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const PostgresProvider: DynamicModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const postgres = config['internalConfig']['config'].postgres;
    const dbConfig = {
      type: postgres.type,
      host: postgres.host,
      port: +postgres.post,
      username: postgres.user,
      password: postgres.password,
      database: postgres.database,
      autoLoadEntities: true,
      synchronize: postgres.sync,
      logging: postgres.logging ? 'all' : null,
      autoSchemaSync: postgres.autoSchemaSync,
    } as PostgresConnectionOptions;

    return dbConfig;
  },
});
