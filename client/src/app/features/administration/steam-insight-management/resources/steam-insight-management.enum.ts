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
  ID = 'id',
  UPDATE_TYPE = 'updateType',
  UPDATE_STATUS = 'updateStatus',
  START_TIME = 'startTime',
  END_TIME = 'endTime',
}
