// *** USER TYPES ***
export interface UserCode {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
  active: boolean;
  lastLogin?: Date;
}

export interface UserRole {
  id: number;
  name: string;
  description: string;
}

export interface UserPayload {
  name: string;
  email: string;
  roles: number[];
}

export interface UpdateUserPayload extends UserPayload {
  id: number;
}

// *** ROLE TYPES ***
export interface RoleCode {
  id: number;
  name: string;
  description: string;
  rights: RoleRight[];
  active: boolean;
  inUse: boolean;
}

export interface RoleRight {
  id: number;
  name: string;
  description: string;
}

export interface RolePayload {
  name: string;
  description: string;
  rights: number[];
}

export interface UpdateRolePayload extends RolePayload {
  id: number;
}

// *** RIGHT TYPES ***
export interface RightCode {
  id: number;
  name: string;
  description: string;
  internalName: string;
  active: boolean;
  inUse: boolean;
}

export interface RightPayload {
  name: string;
  description: string;
}

export interface UpdateRightPayload extends RightPayload {
  id: number;
}
