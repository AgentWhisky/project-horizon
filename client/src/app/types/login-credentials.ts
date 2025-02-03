export interface LoginCredentials {
  username: string;
  password: string;
}

export interface NewAccountCredentials extends LoginCredentials {
  creationCode: string;
}
