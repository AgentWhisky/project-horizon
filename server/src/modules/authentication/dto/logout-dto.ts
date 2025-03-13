import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LogoutDto {
  @ApiPropertyOptional({
    type: String,
    description: 'JWT Token Identifier (optional)',
    example: 'abc123-def456',
  })
  @IsOptional()
  @IsString()
  jti?: string;
}
