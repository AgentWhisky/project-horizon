import { ApiProperty } from '@nestjs/swagger';

export class LinkCategoryResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the category' })
  id: number;

  @ApiProperty({ example: 'Technology', description: 'Category name' })
  name: string;

  @ApiProperty({ example: 'Resources related to technology', description: 'Category description' })
  description: string;
}

export class LinkTagResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the tag' })
  id: number;

  @ApiProperty({ example: 'Programming', description: 'The name of the tag' })
  name: string;
}

export class LinkResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the link' })
  id: number;

  @ApiProperty({ example: 'https://example.com', description: 'The URL of the link' })
  url: string;

  @ApiProperty({ example: 'Example Link', description: 'The name/title of the link' })
  name: string;

  @ApiProperty({ example: 'This is a useful link.', description: 'A short description of the link' })
  description: string;

  @ApiProperty({
    type: LinkCategoryResponseDto,
    description: 'The category this link belongs to or null for unassigned',
    nullable: true,
  })
  category: LinkCategoryResponseDto | null;

  @ApiProperty({ type: [LinkTagResponseDto], description: 'Tags associated with this link' })
  tags: LinkTagResponseDto[];

  @ApiProperty({ example: 'azz', description: 'The sort order key of this link' })
  sortKey: string;
}
