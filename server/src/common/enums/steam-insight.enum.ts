export enum UpdateType {
  FULL = 'F',
  INCREMENTAL = 'I',
}

export enum UpdateStatus {
  RUNNING = 'R',
  COMPLETE = 'C',
  FAILED = 'F',
  CANCELED = 'X',
}

export enum SteamInsightUpdateField {
  Id = 'id',
  UpdateType = 'updateType',
  UpdateStatus = 'updateStatus',
  StartTime = 'startTime',
  EndTime = 'endTime',
}
