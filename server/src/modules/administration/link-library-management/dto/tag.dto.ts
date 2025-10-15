import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LINK_TAG_CONFIG } from 'src/common/constants';

export class TagDto {
  @ApiProperty({
    description: 'Name of the link tag',
    example: 'Documentation',
    maxLength: LINK_TAG_CONFIG.NAME_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_TAG_CONFIG.NAME_MAX_LENGTH)
  name: string;
}
