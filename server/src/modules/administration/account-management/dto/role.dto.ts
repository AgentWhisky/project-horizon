import { IsArray, IsInt, IsString } from 'class-validator';

export class RoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsInt({ each: true })
  rights: number[];
}
