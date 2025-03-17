import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CategoryResponseDto {
  @ApiProperty({ description: 'Unique identifier for the category' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Name of the category' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the category' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Indicates if the category is in use' })
  @IsBoolean()
  inUse: boolean;
}
