import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsArray,
  Max,
  Min,
  IsUrl,
  IsEnum,
  ValidateNested,
  IsBoolean,
} from 'class-validator';

import { ImageContrastBackground } from 'src/common/enums';
import { LINK_CONFIG, LINK_CATEGORY_CONFIG, LINK_TAG_CONFIG } from 'src/common/constants';

export class TagImportDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'Documentation', maxLength: LINK_TAG_CONFIG.NAME_MAX_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_TAG_CONFIG.NAME_MAX_LENGTH)
  name: string;
}

export class CategoryImportDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'Productivity Tools', maxLength: LINK_CATEGORY_CONFIG.NAME_MAX_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CATEGORY_CONFIG.NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({
    example: 'Links and resources related to workflow automation and productivity enhancement.',
    maxLength: LINK_CATEGORY_CONFIG.DESC_MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CATEGORY_CONFIG.DESC_MAX_LENGTH)
  description: string;
}

export class LinkImportDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'Official Docs', maxLength: LINK_CONFIG.NAME_MAX_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CONFIG.NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({ example: 'https://example.com/docs' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'https://example.com/icon.png' })
  @IsUrl()
  icon: string;

  @ApiProperty({ example: 'Documentation for internal systems' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CONFIG.DESC_MAX_LENGTH)
  description: string;

  @ApiProperty({ example: 2, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99999)
  category: number | null;

  @ApiProperty({ example: [1, 3, 5] })
  @IsArray()
  @IsInt({ each: true })
  @Max(99999, { each: true })
  tags: number[];

  @ApiProperty({ example: true, description: 'Indicates if the link is active', required: false })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ example: '000000:100000', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  sortKey: string;

  @ApiProperty({ enum: ImageContrastBackground, example: ImageContrastBackground.DARK })
  @IsEnum(ImageContrastBackground)
  contrastBackground: ImageContrastBackground;
}

export class LinkLibraryDto {
  @ApiProperty({
    description: 'All link items within the exported library',
    type: [LinkImportDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkImportDto)
  links: LinkImportDto[];

  @ApiProperty({
    description: 'All categories used by links in this library',
    type: [CategoryImportDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryImportDto)
  categories: CategoryImportDto[];

  @ApiProperty({
    description: 'All tags used by links in this library',
    type: [TagImportDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagImportDto)
  tags: TagImportDto[];
}
