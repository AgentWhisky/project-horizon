import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsArray } from 'class-validator';

export class LinkCategoryDto {
  @ApiProperty({ description: 'The unique identifier of the link category' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'The name of the link category' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'A description of the link category' })
  @IsString()
  description: string;
}

export class LinkTagDto {
  @ApiProperty({ description: 'The unique identifier of the link tag' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'The name of the link tag' })
  @IsString()
  name: string;
}

export class LinkResponseDto {
  @ApiProperty({ description: 'The unique identifier of the link' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'The URL of the link' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'The name of the link' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'A description of the link' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The category of the link',
    type: LinkCategoryDto,
    nullable: true,
  })
  category: LinkCategoryDto | null;

  @ApiProperty({ description: 'The tags associated with the link', type: [LinkTagDto] })
  @IsArray()
  tags: LinkTagDto[];

  @ApiProperty({ description: 'Sort Order Key of the link' })
  @IsString()
  sortKey: string;
}
