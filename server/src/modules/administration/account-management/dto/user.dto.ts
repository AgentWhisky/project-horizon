import { IsArray, IsInt, IsString, Length } from 'class-validator';
import { ACCOUNT_NAME_LENGTH } from 'src/common/constants/validation.constants';

export class UserDto {
  @IsString()
  @Length(ACCOUNT_NAME_LENGTH.MIN, ACCOUNT_NAME_LENGTH.MAX)
  name: string;

  @IsArray()
  @IsInt({ each: true })
  roles: number[];
}
