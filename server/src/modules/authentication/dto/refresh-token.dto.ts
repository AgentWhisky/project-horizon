import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token to obtain a new access token',
    example: 'dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
