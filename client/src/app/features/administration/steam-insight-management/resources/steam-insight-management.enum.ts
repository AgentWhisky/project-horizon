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

export enum SteamInsightAppField {
  APPID = 'appid',
  NAME = 'name',
  TYPE = 'type',
  IS_ADULT = 'isAdult',
  VALIDATION_FAILED = 'validationFailed',
  ACTIVE = 'active',
  CREATED_DATE = 'createdDate',
  UPDATED_DATE = 'updatedDate',
}
