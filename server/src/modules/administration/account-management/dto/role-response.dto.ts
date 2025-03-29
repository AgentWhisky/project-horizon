import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleRightDto {
  @ApiProperty({ description: 'Unique identifier of the role right', example: 101 })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Name of the role right', example: 'VIEW_DASHBOARD' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the role right', example: 'Allows viewing the admin dashboard' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class RoleResponseDto {
  @ApiProperty({ description: 'Unique identifier of the role', example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Name of the role', example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the role', example: 'Administrator with full access' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'List of rights assigned to the role', type: [RoleRightDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleRightDto)
  rights: RoleRightDto[];
}
