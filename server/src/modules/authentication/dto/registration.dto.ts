import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CREATION_CODE_LENGTH } from 'src/common/constants/creation-code.constants';
import { ACCOUNT_NAME_LENGTH, PASSWORD_LENGTH, USERNAME_LENGTH } from 'src/common/constants/validation.constants';

export class RegistrationDto {
  @ApiProperty({
    description: 'Name for the new account',
    example: 'John Doe',
    minLength: ACCOUNT_NAME_LENGTH.MIN,
    maxLength: ACCOUNT_NAME_LENGTH.MAX,
  })
  @IsString()
  @IsNotEmpty()
  @Length(USERNAME_LENGTH.MIN, USERNAME_LENGTH.MAX)
  name: string;

  @ApiProperty({
    description: 'Username for the new account',
    example: 'john_doe',
    minLength: USERNAME_LENGTH.MIN,
    maxLength: USERNAME_LENGTH.MAX,
  })
  @IsString()
  @IsNotEmpty()
  @Length(USERNAME_LENGTH.MIN, USERNAME_LENGTH.MAX)
  username: string;

  @ApiProperty({
    description: 'Password for the new account',
    example: 'StrongPassword123!',
    minLength: PASSWORD_LENGTH.MIN,
    maxLength: PASSWORD_LENGTH.MAX,
  })
  @IsString()
  @IsNotEmpty()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  password: string;

  @ApiProperty({
    description: 'Creation code required for registration',
    example: 'ABC123XYZ456',
    minLength: CREATION_CODE_LENGTH,
    maxLength: CREATION_CODE_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @Length(CREATION_CODE_LENGTH, CREATION_CODE_LENGTH)
  creationCode: string;
}
