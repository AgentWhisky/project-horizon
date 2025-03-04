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
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
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
