export interface UserData {
  id: number;
  name: string;
  email: string;
  roles: number[];
}

export interface UserResponse {
  id?: number;
  name: string;
  email: string;
  roles: BaseRole[];
  active: boolean;
  lastLogin: Date;
}

export interface BaseRole {
  id: number;
  name: string;
  description: string;
  rights: BaseRight[];
}

export interface Role extends BaseRole {
  active: boolean;
}

export interface BaseRight {
  id: number;
  name: string;
  description: string;
  internalName: string;
  active: boolean;
}

export interface Right extends BaseRight {
  internalName: string;
  active: boolean;
}
