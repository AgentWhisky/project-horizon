export interface AuthInfo {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface UserInfo {
  userId: number;
  name: string;
  username: string;
  roles: UserRole[];
  rights: UserRights[];
  iat: number;
  exp: number;
  jti: string;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface UserRights {
  id: number;
  internalName: string;
}
