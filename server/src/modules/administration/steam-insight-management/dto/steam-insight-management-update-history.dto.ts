import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder, SteamInsightUpdateField, UpdateStatus, UpdateType } from '@hz/common/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SteamInsightUpdatesDto {
  @ApiPropertyOptional({ description: 'Page number (0-Starting)', type: Number, example: 1, default: 1 })
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

  @ApiPropertyOptional({ description: 'Field to sort by', enum: SteamInsightUpdateField, example: 'id', default: 'id' })
  @IsOptional()
  @IsEnum(SteamInsightUpdateField, { message: 'sortBy must be a valid field' })
  sortBy: string = 'id';

  @ApiPropertyOptional({ description: 'Sort direction', enum: SortOrder, example: 'DESC', default: 'DESC' })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'sortOrder must be ASC or DESC' })
  sortOrder: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'Filter by update status', enum: UpdateStatus })
  @IsOptional()
  @IsEnum(UpdateStatus)
  status?: UpdateStatus;

  @ApiPropertyOptional({ description: 'Filter by update type', enum: UpdateType })
  @IsOptional()
  @IsEnum(UpdateType)
  type?: UpdateType;
}
