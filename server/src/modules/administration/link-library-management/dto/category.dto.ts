import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CATEGORY_DESC_MAX_LENGTH, CATEGORY_NAME_MAX_LENGTH } from 'src/common/constants/validation.constants';

export class CategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    maxLength: CATEGORY_NAME_MAX_LENGTH,
    example: 'Category Name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CATEGORY_NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({
    description: 'The description of the category',
    maxLength: CATEGORY_DESC_MAX_LENGTH,
    example: 'This is a description of the category.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(CATEGORY_DESC_MAX_LENGTH)
  description: string;
}
