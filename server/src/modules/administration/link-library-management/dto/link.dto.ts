import { IsString, IsInt, IsArray, IsOptional, IsUrl, ArrayNotEmpty, IsNotEmpty, Length } from 'class-validator';
import { USERNAME_LENGTH } from 'src/common/constants/validation.constants';

export class LinkDto {
  @IsString()
  @IsNotEmpty()
  @Length(USERNAME_LENGTH.MIN, USERNAME_LENGTH.MAX)
  name: string;

  @IsUrl()
  url: string;

  @IsString()
  description: string;

  @IsInt()
  category: number;

  @IsArray()
  @IsInt({ each: true })
  tags: number[];

  @IsOptional()
  @IsUrl()
  thumbnail?: string;
}
