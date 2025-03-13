import { ApiProperty } from '@nestjs/swagger';

export class AdminDashboardResponseDto {
  @ApiProperty({ example: 'ABC123XYZ456', description: 'The creation code for admin dashboard' })
  creationCode: string;
}

export class CreationCodeRefreshDto {
  @ApiProperty({ example: 'ABC123XYZ456', description: 'The refreshed creation code' })
  creationCode: string;
}
