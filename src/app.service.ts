import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { config } from './config';
@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private appConfig: ConfigType<typeof config>, // private utilsService: UtilsService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getInfoApi(): Promise<object> {
    return this.appConfig.project;
  }
}
