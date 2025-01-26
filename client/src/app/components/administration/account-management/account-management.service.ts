import { inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import { NewRole, NewUser, Right, RightCode, Role, RoleCode, User, UserCode } from './account-management';

@Injectable({
  providedIn: 'root',
})
export class AccountManagementService {
  private tokenService = inject(TokenService);

  private _users = signal<UserCode[]>([]);
  readonly users = this._users.asReadonly();

  private _roles = signal<RoleCode[]>([]);
  readonly roles = this._roles.asReadonly();

  private _rights = signal<RightCode[]>([]);
  readonly rights = this._rights.asReadonly();

  constructor() {}

  loadMockData() {
    const mockRights: RightCode[] = [
      {
        id: 1,
        name: 'View Dashboard',
        internalName: 'VIEW_DASHBOARD',
        description: 'Allows viewing the dashboard',
        active: true,
        inUse: true,
      },
      { id: 2, name: 'Edit Users', internalName: 'EDIT_USERS', description: 'Allows editing user details', active: false, inUse: false },
      { id: 3, name: 'Manage Roles', internalName: 'MANAGE_ROLES', description: 'Allows managing user roles', active: true, inUse: true },
      { id: 4, name: 'Access Reports', internalName: 'ACCESS_REPORTS', description: 'Allows accessing reports', active: true, inUse: true },
      {
        id: 5,
        name: 'Manage Settings',
        internalName: 'MANAGE_SETTINGS',
        description: 'Allows managing system settings',
        active: false,
        inUse: false,
      },
      { id: 6, name: 'View Logs', internalName: 'VIEW_LOGS', description: 'Allows viewing system logs', active: true, inUse: true },
      {
        id: 7,
        name: 'Delete Records',
        internalName: 'DELETE_RECORDS',
        description: 'Allows deleting records',
        active: false,
        inUse: false,
      },
      { id: 8, name: 'Add Users', internalName: 'ADD_USERS', description: 'Allows adding new users', active: true, inUse: true },
      {
        id: 9,
        name: 'Approve Requests',
        internalName: 'APPROVE_REQUESTS',
        description: 'Allows approving requests',
        active: true,
        inUse: true,
      },
      { id: 10, name: 'Export Data', internalName: 'EXPORT_DATA', description: 'Allows exporting data', active: false, inUse: false },
    ];

    const mockRoles: RoleCode[] = [
      {
        id: 1,
        name: 'Administrator',
        description: 'Has full access to all settings and management features.',
        rights: [mockRights[0], mockRights[1], mockRights[2], mockRights[3]],
        active: true,
        inUse: true,
      },
      {
        id: 2,
        name: 'Editor',
        description: 'Can edit content but cannot change system settings.',
        rights: [mockRights[0], mockRights[4], mockRights[5], mockRights[6]],
        active: true,
        inUse: true,
      },
      {
        id: 3,
        name: 'Viewer',
        description: 'Can only view content, no editing or management permissions.',
        rights: [mockRights[0], mockRights[7], mockRights[8]],
        active: false,
        inUse: false,
      },
      {
        id: 4,
        name: 'Analyst',
        description: 'Has access to analyze data but cannot modify settings.',
        rights: [mockRights[3], mockRights[4], mockRights[9]],
        active: true,
        inUse: true,
      },
      {
        id: 5,
        name: 'Auditor',
        description: 'Can review logs and actions but cannot make changes.',
        rights: [mockRights[5], mockRights[6], mockRights[8]],
        active: false,
        inUse: false,
      },
      {
        id: 6,
        name: 'Support',
        description: 'Provides assistance with technical issues and user support.',
        rights: [mockRights[1], mockRights[2], mockRights[7]],
        active: true,
        inUse: true,
      },
      {
        id: 7,
        name: 'Developer',
        description: 'Responsible for coding and deploying new features.',
        rights: [mockRights[2], mockRights[8], mockRights[9]],
        active: true,
        inUse: true,
      },
      {
        id: 8,
        name: 'Manager',
        description: 'Oversees team and operational processes.',
        rights: [mockRights[3], mockRights[5], mockRights[6]],
        active: true,
        inUse: true,
      },
      {
        id: 9,
        name: 'Reviewer',
        description: 'Reviews content for accuracy and compliance.',
        rights: [mockRights[1], mockRights[8], mockRights[9]],
        active: false,
        inUse: false,
      },
      {
        id: 10,
        name: 'Operator',
        description: 'Handles operational tasks and system monitoring.',
        rights: [mockRights[0], mockRights[4], mockRights[5]],
        active: true,
        inUse: true,
      },
    ];

    const mockUsers: UserCode[] = [
      { id: 1, name: 'Alice Smith', email: 'alice@example.com', roles: [mockRoles[0], mockRoles[1]], active: true, lastLogin: new Date() },
      { id: 2, name: 'Bob Johnson', email: 'bob@example.com', roles: [mockRoles[2], mockRoles[3]], active: true, lastLogin: new Date() },
      {
        id: 3,
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        roles: [mockRoles[1], mockRoles[4]],
        active: false,
        lastLogin: new Date(),
      },
      { id: 4, name: 'Diana Ross', email: 'diana@example.com', roles: [mockRoles[3], mockRoles[5]], active: true, lastLogin: new Date() },
      { id: 5, name: 'Evan White', email: 'evan@example.com', roles: [mockRoles[0], mockRoles[6]], active: true, lastLogin: new Date() },
      { id: 6, name: 'Fiona Green', email: 'fiona@example.com', roles: [mockRoles[7], mockRoles[8]], active: false, lastLogin: new Date() },
      { id: 7, name: 'George Hill', email: 'george@example.com', roles: [mockRoles[9]], active: true, lastLogin: new Date() },
      { id: 8, name: 'Helen Black', email: 'helen@example.com', roles: [mockRoles[6], mockRoles[7]], active: true, lastLogin: new Date() },
      { id: 9, name: 'Ivy Blue', email: 'ivy@example.com', roles: [mockRoles[8]], active: false, lastLogin: new Date() },
      { id: 10, name: 'Jack Gray', email: 'jack@example.com', roles: [mockRoles[5], mockRoles[9]], active: true, lastLogin: new Date() },
    ];

    this._users.set(mockUsers);
    this._roles.set(mockRoles);
    this._rights.set(mockRights);
  }

  // *** USERS ***
  loadUsers() {
    console.warn('LOAD-USERS NOT IMPLEMENTED');
  }

  addUser(newUser: NewUser) {
    console.warn('ADD-USER NOT IMPLEMENTED', newUser);
  }

  updateuser(user: User) {
    console.warn('UPDATE-USER NOT IMPLEMENTED', user);
  }

  removeUser(id: number) {
    console.warn('REMOVE-USER NOT IMPLEMENTED', id);
  }

  // *** ROLES ***
  loadRoles() {}

  addRole(newRole: NewRole) {
    console.warn('ADD-ROLE NOT IMPLEMENTED', newRole);
  }

  updateRole(role: Role) {
    console.warn('UPDATE-ROLE NOT IMPLEMENTED', role);
  }

  removeRole(id: number) {
    console.warn('REMOVE-ROLE NOT IMPLEMENTED', id);
  }

  // *** RIGHTS ***
  loadRights() {
    console.warn('LOAD-RIGHTS NOT IMPLEMENTED');
  }

  addRight(newRight: Right) {
    console.warn('ADD-RIGHT NOT IMPLEMENTED', newRight);

    //nameValue.trim().toUpperCase().replace(/\s+/g, '_');
  }

  updateRight(right: Right) {
    console.warn('UPDATE-RIGHT NOT IMPLEMENTED', right);
  }

  removeRight(id: number) {
    console.warn('REMOVE-RIGHT NOT IMPLEMENTED', id);
  }
}
