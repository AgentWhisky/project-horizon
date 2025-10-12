import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SortOrder, SteamInsightAppField, SteamInsightAppType } from '@hz/common/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ToBoolean } from '@hz/common/transformers';
import { IsBooleanQuery } from '@hz/common/validators';
import { INT32_MAX } from '@hz/common/constants';

export class SteamInsightAppsQueryDto {
  @ApiPropertyOptional({ description: 'Page number (0-Starting)', type: Number, example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(99999)
  @Min(0)
  page = 0;

  @ApiPropertyOptional({ description: 'Results per page', type: Number, example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize = 20;

  @ApiPropertyOptional({ description: 'App id for Steam app', type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(INT32_MAX)
  appid?: number;

  @ApiPropertyOptional({ description: 'Filter by app type', enum: SteamInsightAppType })
  @IsOptional()
  @IsEnum(SteamInsightAppType)
  type?: SteamInsightAppType;

  @ApiPropertyOptional({ description: 'Keywords for filtering, comma separated', type: String, example: 'Counter,Strike,Global,Offensive' })
  @IsOptional()
  @Type(() => String)
  keywords?: string;

  @ApiPropertyOptional({ description: 'Field to sort by', enum: SteamInsightAppField, example: 'appid', default: 'appid' })
  @IsOptional()
  @IsEnum(SteamInsightAppField, { message: 'sortBy must be a valid field' })
  sortBy?: string = 'appid';

  @ApiPropertyOptional({ description: 'Sort direction', enum: SortOrder, example: 'DESC', default: 'DESC' })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'sortOrder must be ASC or DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'Filter by adult-only apps', type: Boolean })
  @IsOptional()
  @IsBooleanQuery()
  @Transform(ToBoolean())
  isAdult?: boolean;

  @ApiPropertyOptional({ description: 'Filter by validation failed apps', type: Boolean })
  @IsOptional()
  @IsBooleanQuery()
  @Transform(ToBoolean())
  validationFailed?: boolean;

  @ApiPropertyOptional({ description: 'Filter by active apps', type: Boolean })
  @IsOptional()
  @IsBooleanQuery()
  @Transform(ToBoolean())
  active?: boolean;
}
