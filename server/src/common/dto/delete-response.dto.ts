import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({ description: 'The ID of the deleted entity', example: 1 })
  id: number;

  @ApiProperty({ description: 'Indicates if the deletion was successful', example: true })
  success: boolean;
}
