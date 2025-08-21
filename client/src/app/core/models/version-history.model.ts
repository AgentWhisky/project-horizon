export interface VersionEntryRaw {
  version: string;
  date: string;
  description: string;
}

export interface VersionEntry {
  version: string;
  date: Date;
  description: string;
}
