import { IsArray, IsInt, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  name: string;

  @IsArray()
  @IsInt({ each: true })
  roles: number[];
}
