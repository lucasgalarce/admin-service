import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class IdParams {
  @IsString()
  @Type(() => String)
  @ApiProperty({ description: 'Id', type: String, required: true })
  id: string;
}
