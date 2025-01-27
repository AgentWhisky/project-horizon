import { IsArray, IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';

// *** DTO for creating or updating a Role from the client ***
export class RoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsInt({ each: true })
  rights: number[];
}

// *** DTO for the response of a Role to the client ***
export class RoleResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  rights: RoleRightDto[];

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  inUse: boolean;
}

// *** DTO for simplified Right used in Role response to the client ***
export class RoleRightDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;
}
