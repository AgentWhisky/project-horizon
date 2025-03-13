import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TAG_MAX_LENGTH } from 'src/common/constants/validation.constants';

export class TagDto {
  @ApiProperty({
    description: 'The name of the tag',
    maxLength: TAG_MAX_LENGTH,
    example: 'Example Tag',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(TAG_MAX_LENGTH)
  name: string;
}
