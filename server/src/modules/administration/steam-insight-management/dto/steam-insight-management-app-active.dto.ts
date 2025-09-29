import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class AppActiveDto {
  @ApiProperty({ type: Boolean, description: 'The active status of an app', example: true })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
