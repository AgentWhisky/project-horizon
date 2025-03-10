import { IsArray, IsInt, IsNotEmpty, IsString, Length } from 'class-validator';
import { ROLE_DESC_LENGTH, ROLE_NAME_LENGTH } from 'src/common/constants/validation.constants';

export class RoleDto {
  @IsString()
  @IsNotEmpty()
  @Length(ROLE_NAME_LENGTH.MIN, ROLE_NAME_LENGTH.MAX)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(ROLE_DESC_LENGTH.MIN, ROLE_DESC_LENGTH.MAX)
  description: string;

  @IsArray()
  @IsInt({ each: true })
  rights: number[];
}
