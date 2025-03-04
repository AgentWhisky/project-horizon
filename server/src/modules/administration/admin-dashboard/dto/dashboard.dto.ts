import { IsString } from 'class-validator';

// *** DTO for the response of the admin Dashboard ***
export class DashboardResponseDto {
  @IsString()
  creationCode: string;
}
