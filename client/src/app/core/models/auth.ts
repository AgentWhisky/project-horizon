export interface AuthInfo {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface AuthInfoPayload {
  sub: number;
  name: string;
  username: string;
  roles: UserRole[];
  rights: UserRight[];
  iat: number;
  exp: number;
  jti: string;
}

export interface UserInfo {
  userId: number;
  name: string;
  username: string;
  roles: UserRole[];
  rights: UserRight[];
  iat: number;
  exp: number;
  jti: string;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface UserRight {
  id: number;
  internalName: string;
}
