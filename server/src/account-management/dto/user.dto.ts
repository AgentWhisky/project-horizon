import { IsArray, IsBoolean, IsDate, IsEmail, IsInt, IsNumber, IsString } from 'class-validator';

// *** DTO for creating or updating a User from the client ***
export class UserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsInt({ each: true })
  roles: number[];
}

// *** DTO for the response of a User to the client ***
export class UserResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsArray()
  roles: UserRoleDto[];

  @IsBoolean()
  active: boolean;

  @IsDate()
  lastLogin: Date;
}

// *** DTO for simplified Role used in User response to the client ***
export class UserRoleDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;
}
