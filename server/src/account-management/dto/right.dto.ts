import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class RightDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

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
