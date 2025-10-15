import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { LINK_CATEGORY_CONFIG } from 'src/common/constants';

export class CategoryDto {
  @ApiProperty({
    description: 'Name of the link category',
    example: 'Productivity Tools',
    maxLength: LINK_CATEGORY_CONFIG.NAME_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CATEGORY_CONFIG.NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({
    description: 'Description of the link category',
    example: 'Links and resources related to workflow automation and productivity enhancement',
    maxLength: LINK_CATEGORY_CONFIG.DESC_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CATEGORY_CONFIG.DESC_MAX_LENGTH)
  description: string;
}
