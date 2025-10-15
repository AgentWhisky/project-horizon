import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  Max,
  ArrayMaxSize,
  Min,
  ValidateIf,
} from 'class-validator';

import { LINK_CONFIG } from '@hz/common/constants';
import { ImageContrastBackground } from '@hz/common/enums';

export class LinkDto {
  @ApiProperty({
    description: 'Name of the link',
    example: 'Horizon Platform',
    maxLength: LINK_CONFIG.NAME_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CONFIG.NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({
    description: 'Full URL of the link',
    example: 'https://aw-horizon.com',
    maxLength: 2048,
  })
  @IsUrl()
  @MaxLength(2048)
  url: string;

  @ApiProperty({
    description: 'Icon URL for the link image or icon',
    example: 'https://aw-horizon.com/assets/icons/hz-icon.png',
    maxLength: 2048,
  })
  @IsUrl({ require_protocol: true })
  @MaxLength(2048)
  icon: string;

  @ApiProperty({
    description: 'Description of the link or its purpose',
    example: 'Main access point to the Horizon application',
    maxLength: LINK_CONFIG.DESC_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CONFIG.DESC_MAX_LENGTH)
  description: string;

  @ApiProperty({
    description: 'Category ID for the link (null if unassigned)',
    example: 5,
    nullable: true,
    required: false,
    minimum: 1,
    maximum: 99999,
  })
  @ValidateIf((o) => o.category !== null)
  @IsInt()
  @Min(1)
  @Max(99999)
  @IsOptional()
  category: number | null;

  @ApiProperty({
    description: 'Array of tag IDs associated with this link (max 50)',
    example: [1, 2, 5],
    type: [Number],
    maxItems: 50,
    maximum: 99999,
  })
  @IsArray()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  @Max(99999, { each: true })
  tags: number[];

  @ApiProperty({
    description: 'Sort key used to control the display order of links',
    example: '000000:100000',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  sortKey: string;

  @ApiProperty({
    description: 'Determines the text/icon contrast background for the link card',
    enum: ImageContrastBackground,
    example: ImageContrastBackground.DARK,
  })
  @IsEnum(ImageContrastBackground)
  contrastBackground: ImageContrastBackground;
}
