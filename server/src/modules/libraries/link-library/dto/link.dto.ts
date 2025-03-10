import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LinkCategoryDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the category' })
  id: number;

  @ApiProperty({ example: 'Technology', description: 'Category name' })
  name: string;

  @ApiProperty({ example: 'Resources related to technology', description: 'Category description' })
  description: string;
}

export class LinkTagDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the tag' })
  id: number;

  @ApiProperty({ example: 'Programming', description: 'The name of the tag' })
  name: string;
}

export class LinkDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the link' })
  id: number;

  @ApiProperty({ example: 'https://example.com', description: 'The URL of the link' })
  url: string;

  @ApiProperty({ example: 'Example Link', description: 'The name/title of the link' })
  name: string;

  @ApiProperty({ example: 'This is a useful link.', description: 'A short description of the link' })
  description: string;

  @ApiProperty({ type: LinkCategoryDto, description: 'The category this link belongs to' })
  category: LinkCategoryDto;

  @ApiProperty({ type: [LinkTagDto], description: 'Tags associated with this link' })
  tags: LinkTagDto[];

  @ApiPropertyOptional({ example: 'https://example.com/thumbnail.jpg', description: 'Thumbnail image URL (optional)' })
  thumbnail?: string;
}
