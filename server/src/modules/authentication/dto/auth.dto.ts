import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CREATION_CODE_LENGTH } from 'src/common/constants/creation-code.constants';
import { PASSWORD_LENGTH, USERNAME_LENGTH } from 'src/common/constants/validation.constants';

export class RegistrationDto {
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

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token to obtain a new access token',
    example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for renewing access',
    example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Type of the token',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'Expiration time in seconds',
    example: 3600,
  })
  expiresIn: number;
}
