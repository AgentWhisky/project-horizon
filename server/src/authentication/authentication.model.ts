export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegistrationInfo {
  username: string;
  password: string;
  creationCode: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthPayload {
  sub: number;
  name: string;
  username: string;
  roles: AuthPayloadRoles[];
  rights: AuthPayloadRights[];
  jti: string;
}

interface AuthPayloadRoles {
  id: number;
  name: string;
}

interface AuthPayloadRights {
  id: number;
  internalName: string;
}
