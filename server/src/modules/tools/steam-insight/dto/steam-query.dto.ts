import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SteamGameQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10000)
  page = 0;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  allowAdultContent = false;
}
