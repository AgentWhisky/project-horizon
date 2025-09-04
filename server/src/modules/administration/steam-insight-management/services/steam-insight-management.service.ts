import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SteamInsightManagementService {
  private readonly logger = new Logger(SteamInsightManagementService.name);
}
