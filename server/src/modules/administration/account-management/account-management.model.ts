// *** USER TYPES ***
export interface UserPayload {
  name: string;
  roles: number[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  roles: UserRole[];
  active: boolean;
  lastLogin: Date;
}

export interface UserRole {
  id: number;
  name: string;
  description: string;
}

// *** ROLE TYPES ***
export interface RolePayload {
  name: string;
  description: string;
  rights: number[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  rights: RoleRight[];
}

export interface RoleRight {
  id: number;
  name: string;
  description: string;
}

// *** RIGHT TYPES ***
export interface Right {
  id: number;
  name: string;
  description: string;
  internalName: string;
  inUse: boolean;
}
