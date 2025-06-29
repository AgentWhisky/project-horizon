import { ApiProperty } from '@nestjs/swagger';

export class SteamAppSummaryDto {
  @ApiProperty({ example: 1245620 })
  appid: number;

  @ApiProperty({ example: 'Elden Ring' })
  name: string;

  @ApiProperty({ example: 'https://cdn.steamstatic.com/...' })
  headerImage: string;

  @ApiProperty({ example: 'Rise, Tarnished, and be guided by grace...' })
  shortDescription: string;

  @ApiProperty({ example: ['Single-player', 'Steam Achievements', 'Family Sharing'] })
  categories: string[];
}
