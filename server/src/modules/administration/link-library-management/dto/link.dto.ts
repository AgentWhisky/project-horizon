import { IsString, IsInt, IsArray, IsOptional, IsUrl, IsNotEmpty, Length, MaxLength } from 'class-validator';
import { USERNAME_LENGTH } from 'src/common/constants/validation.constants';

export class LinkDto {
  @IsString()
  @IsNotEmpty()
  @Length(USERNAME_LENGTH.MIN, USERNAME_LENGTH.MAX)
  name: string;

  @IsUrl()
  @MaxLength(2048)
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
