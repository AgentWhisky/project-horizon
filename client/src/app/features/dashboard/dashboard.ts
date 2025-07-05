import { ContentTileConfig } from "../../shared/components/content-tile/content-tile";

export interface DashboardSection {
  sectionTitle: string;
  tileConfigs: ContentTileConfig[];
}
