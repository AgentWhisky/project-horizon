import { ApiProperty } from '@nestjs/swagger';

// *** Steam Insight Log Entry DTO ***
export class SteamAppUpdateLogDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2025-05-01T12:00:00Z' })
  startTime: Date;

  @ApiProperty({ example: '2025-05-01T12:30:00Z' })
  endTime: Date;

  @ApiProperty({ example: 150 })
  successCount: number;

  @ApiProperty({ example: 5 })
  failureCount: number;

  @ApiProperty({ example: [12345, 67890] })
  successAppIds: number[];

  @ApiProperty({ example: [54321, 98765] })
  failureAppIds: number[];

  @ApiProperty({ example: 60 })
  createdGameCount: number;

  @ApiProperty({ example: 40 })
  createdDlcCount: number;

  @ApiProperty({ example: 30 })
  updatedGameCount: number;

  @ApiProperty({ example: 20 })
  updatedDlcCount: number;

  @ApiProperty({ example: 'Minor network hiccups observed in some updates.' })
  notes: string;
}

// *** Steam Insight DTO ***
export class SteamInsightDto {
  // Last Week
  @ApiProperty({
    type: [SteamAppUpdateLogDto],
    description: 'List of recent Steam app update logs',
  })
  logs: SteamAppUpdateLogDto[];

  @ApiProperty({ example: 60, description: 'Total newly added games this week' })
  totalNewGames: number;

  @ApiProperty({ example: 30, description: 'Total updated games this week' })
  totalUpdatedGames: number;

  @ApiProperty({ example: 25, description: 'Total newly added DLC this week' })
  totalNewDlc: number;

  @ApiProperty({ example: 15, description: 'Total updated DLC this week' })
  totalUpdatedDlc: number;

  @ApiProperty({ example: 8, description: 'Total failed update attempts this week' })
  totalFailures: number;

  // All Time
  @ApiProperty({ example: 5000, description: 'Total number of games in the database' })
  totalGames: number;

  @ApiProperty({ example: 1200, description: 'Total number of DLC in the database' })
  totalDLC: number;

  @ApiProperty({ example: '2025-05-11T16:26:27.071Z', description: 'Last modified date of any game entry' })
  gameLastModified: Date;

  @ApiProperty({ example: '2025-05-10T14:15:03.224Z', description: 'Last modified date of any DLC entry' })
  dlcLastModified: Date;

  @ApiProperty({ example: 1908260, description: 'Highest Steam App ID seen in the database' })
  maxAppid: number;
}

// *** Settings DTO ***
export class SettingsInfoDto {
  @ApiProperty({ example: 'ABC123XYZ456' })
  creationCode: string;
}

// *** Dashboard Response DTO ***
export class AdminDashboardResponseDto {
  @ApiProperty({ type: SettingsInfoDto })
  settings: SettingsInfoDto;

  @ApiProperty({ type: SteamInsightDto })
  steamInsight: SteamInsightDto;
}

// *** REFRESH DTO ***
export class CreationCodeRefreshDto {
  @ApiProperty({ example: 'ABC123XYZ456', description: 'The refreshed creation code' })
  creationCode: string;
}
