export interface ContentTileConfig {
  id: number;
  title: string;
  description: string;
  src: string;
  alt: string;

  routerLink?: string;
  disabled?: boolean;
}
