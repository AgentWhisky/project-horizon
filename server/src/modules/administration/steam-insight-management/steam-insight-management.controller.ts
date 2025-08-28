import { Controller } from '@nestjs/common';
import { SteamInsightManagementService } from './steam-insight-management.service';

@Controller('steam-insight-management')
export class SteamInsightManagementController {
  constructor(private readonly steamInsightManagementService: SteamInsightManagementService) {
    
  }
}
