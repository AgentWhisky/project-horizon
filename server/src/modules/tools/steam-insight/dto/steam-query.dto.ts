import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class SteamGameQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  pageNumber = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  allowAdultContent = false;
}
