import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, ValidateIf } from 'class-validator';

export class UpdateLinkSortKeyDto {
  @ApiProperty({
    description: 'New sort key for the link',
    example: '000000:100000',
  })
  @IsString()
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
  @IsOptional()
  category: number | null;
}
