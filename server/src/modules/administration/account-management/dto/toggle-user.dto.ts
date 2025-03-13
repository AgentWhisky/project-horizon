import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UserActiveDto {
  @ApiProperty({
    type: Boolean,
    description: 'Whether the user is active',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
