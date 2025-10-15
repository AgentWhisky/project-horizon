import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateIf } from 'class-validator';

export class UpdateLinkSortKeyDto {
  @ApiProperty({
    description: 'New sort key for the link',
    example: '000000:100000',
  })
  @IsString()
  @MaxLength(100)
  sortKey: string;

  @ApiProperty({
    description: 'Category ID for the link (null if unassigned)',
    example: 5,
    nullable: true,
    required: false,
  })
  @ValidateIf((o) => o.category !== null)
  @IsInt()
  @Min(1)
  @Max(99999)
  @IsOptional()
  category: number | null;
}
