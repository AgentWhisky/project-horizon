import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsOptional, IsUrl, IsNotEmpty, MaxLength } from 'class-validator';
import { LINK_DESC_MAX_LENGTH, LINK_NAME_MAX_LENGTH } from 'src/common/constants/validation.constants';

export class LinkDto {
  @ApiProperty({
    description: 'The name of the link',
    maxLength: LINK_NAME_MAX_LENGTH,
    example: 'Example Link',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({
    description: 'The URL of the link',
    maxLength: 2048,
    example: 'https://example.com',
  })
  @IsUrl()
  @MaxLength(2048)
  url: string;

  @ApiProperty({
    description: 'A brief description of the link',
    maxLength: LINK_DESC_MAX_LENGTH,
    example: 'This is an example link description.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_DESC_MAX_LENGTH)
  description: string;

  @ApiProperty({
    description: 'The ID of the category the link belongs to',
    example: 1,
  })
  @IsInt()
  category: number;

  @ApiProperty({
    description: 'An array of tag IDs associated with the link',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  tags: number[];
}
