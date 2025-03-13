import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty, IsBoolean, IsArray, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UserRoleDto {
  @ApiProperty({ description: 'Unique identifier of the user role', example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Name of the user role', example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the user role', example: 'Administrator with full access' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'Unique identifier of the user', example: 123 })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Username of the user', example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'List of roles assigned to the user', type: [UserRoleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserRoleDto)
  roles: UserRoleDto[];

  @ApiProperty({ description: 'Whether the user account is active', example: true })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ description: 'Timestamp of the last login', example: '2024-03-11T12:34:56.789Z' })
  @IsDate()
  @Type(() => Date)
  lastLogin: Date;
}
