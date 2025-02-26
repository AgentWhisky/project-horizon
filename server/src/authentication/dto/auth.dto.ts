import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RegistrationDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @Length(4, 20, { message: 'Username must be between 4 and 20 characters' })
  username: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 100, { message: 'Password must be between 6 and 100 characters' })
  password: string;

  @IsString({ message: 'Creation code must be a string' })
  @IsNotEmpty({ message: 'Creation code is required' })
  @Length(6, 30, { message: 'Creation code must be between 6 and 30 characters' }) // Adjust length as needed
  creationCode: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
