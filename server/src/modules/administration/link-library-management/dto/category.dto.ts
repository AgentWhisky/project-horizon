import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LINK_CATEGORY_CONFIG } from 'src/common/constants/validation.constants';

export class CategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CATEGORY_CONFIG.NAME_MAX_LENGTH)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CATEGORY_CONFIG.DESC_MAX_LENGTH)
  description: string;
}
