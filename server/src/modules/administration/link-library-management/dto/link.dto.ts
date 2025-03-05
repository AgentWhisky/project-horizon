import { IsString, IsInt, IsArray, IsOptional, IsUrl, ArrayNotEmpty } from 'class-validator';

export class LinkDto {
  @IsUrl()
  url: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  category: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  tags: number[];

  @IsOptional()
  @IsUrl()
  thumbnail?: string;
}
