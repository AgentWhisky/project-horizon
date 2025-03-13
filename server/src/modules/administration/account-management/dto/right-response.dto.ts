import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class RightResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the right',
    example: 1,
  })
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'The name of the right',
    example: 'Admin Access',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A detailed description of the right',
    example: 'Access to all admin features',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The internal name for the right',
    example: 'admin_access',
  })
  @IsString()
  @IsNotEmpty()
  internalName: string;

  @ApiProperty({
    description: 'Indicates whether the right is in use',
    example: true,
  })
  @IsBoolean()
  inUse: boolean;
}
