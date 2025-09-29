import { SteamInsightAuditType } from '../../resources/steam-insight-management.enum';

export interface SteamInsightAppRaw {
  name: string;
  appid: number;
  type: string;
  audits: SteamInsightAppAudit[];
  [key: string]: unknown;
}

export interface SteamInsightAppAudit {
  id: number;
  appid: number;
  changeType: SteamInsightAuditType;
  changes: Record<string, { before: unknown; after: unknown }>;
  createdDate: Date;
}
