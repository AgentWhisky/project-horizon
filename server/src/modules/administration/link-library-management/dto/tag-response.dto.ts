import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class TagResponseDto {
  @ApiProperty({ description: 'Unique identifier for the tag' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Name of the tag' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Indicates if the tag is in use' })
  @IsBoolean()
  inUse: boolean;
}
