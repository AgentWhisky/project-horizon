export interface User {
  id: number;
  name: string;
  email: string;
}

export interface NewUser {
  name: string;
  email: string;
  roles: number[];
}

export interface UserCode extends User {
  roles: Role[];
  active: boolean;
  lastLogin?: Date;
}

// *** ROLES ***
export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface NewRole {
  name: string;
  description: string;
  rights: number[];
}

export interface RoleCode extends Role {
  rights: Right[];
  active: boolean;
  inUse: boolean;
}

// *** RIGHTS ***
export interface Right {
  id: number;
  name: string;
  description: string;
}

export interface NewRight {
  name: string;
  description: string;
}

export interface RightCode extends Right {
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
