import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CREATION_CODE_LENGTH } from 'src/common/constants/creation-code.constants';
import { PASSWORD_LENGTH, USERNAME_LENGTH } from 'src/common/constants/validation.constants';

export class RegistrationDto {
  @IsString()
  @IsNotEmpty()
  @Length(USERNAME_LENGTH.MIN, USERNAME_LENGTH.MAX)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(CREATION_CODE_LENGTH, CREATION_CODE_LENGTH)
  creationCode: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
