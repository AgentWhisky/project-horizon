import { IsBoolean, IsNumber } from 'class-validator';

// *** DTO for the response of a Deletion to the client ***
export class DeleteResponseDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  success: boolean;
}
