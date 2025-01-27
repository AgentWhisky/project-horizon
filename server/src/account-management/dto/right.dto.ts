import { IsBoolean, IsNumber, IsString } from 'class-validator';

// *** DTO for creating or updating a Right from the client ***
export class RightDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

// *** DTO for the response of a Right to the client ***
export class RightResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  internalName: string;

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  inUse: boolean;
}
