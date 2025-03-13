import { ApiProperty } from "@nestjs/swagger";

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
