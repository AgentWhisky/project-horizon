import { IsString, IsInt, IsArray, IsOptional, IsUrl, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';
import { LINK_CONFIG } from 'src/common/constants/validation.constants';
import { ImageContrastBackground } from 'src/common/enums/link-library.enum';

export class LinkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CONFIG.NAME_MAX_LENGTH)
  name: string;

  @IsUrl()
  @MaxLength(2048)
  url: string;

  @IsString()
  @MaxLength(2048)
  icon: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_CONFIG.DESC_MAX_LENGTH)
  description: string;

  @IsOptional()
  @IsInt()
  category: number | null;

  @IsArray()
  @IsInt({ each: true })
  tags: number[];

  @IsString()
  sortKey: string;

  @IsEnum(ImageContrastBackground)
  contrastBackground: ImageContrastBackground;
}
