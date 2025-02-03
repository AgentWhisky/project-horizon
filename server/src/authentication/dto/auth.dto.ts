import { IsNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  creationCode: string;
}

export class AuthResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  tokenType: string;

  @IsNumber()
  expiresIn: number;

  @IsString()
  refreshToken: string;
}
