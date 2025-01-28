import { inject, Injectable, signal } from '@angular/core';
import { TokenService } from '../../../services/token.service';
import {
  RightCode,
  RightPayload,
  RoleCode,
  RolePayload,
  UpdateRightPayload,
  UpdateRolePayload,
  UpdateUserPayload,
  UserCode,
  UserPayload,
} from './account-management';
import { firstValueFrom } from 'rxjs';
import { DeleteResponse } from '../../../types/delete-response';

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

  // *** USERS ***
  async loadUsers() {
    try {
      const users = await this.getUsers();
      this._users.set(users);
    } catch (error) {
      console.error(`Error fetching user: ${error}`);
    }
  }

  async addUser(newUser: UserPayload) {
    try {
      const user = await this.postUser(newUser);
      this._users.set([...this._users(), user]);
    } catch (error) {
      console.error(`Error creating user: ${error}`);
    }
  }

  async updateUser(updatedUser: UpdateUserPayload) {
    try {
      const { id, ...userPayload } = updatedUser;

      const user = await this.putUser(id, userPayload);

      const updatedIndex = this._users().findIndex((item) => item.id === id);
      const updatedUsers: UserCode[] = [...this._users().filter((item) => item.id !== id)];
      updatedUsers.splice(updatedIndex, 0, user);

      this._users.set(updatedUsers);
    } catch (error) {
      console.error(`Error updating user: ${error}`);
    }
  }

  async removeUser(id: number) {
    try {
      const deleteResponse = await this.deleteUser(id);

      if (deleteResponse.success) {
        this._users.set([...this._users().filter((item) => item.id !== deleteResponse.id)]);
      }
    } catch (error) {
      console.error(`Error removing user: ${error}`);
    }
  }

  // *** ROLES ***
  async loadRoles() {
    try {
      const roles = await this.getRoles();
      this._roles.set(roles);
    } catch (error) {
      console.error(`Error fetching user roles: ${error}`);
    }
  }

  async addRole(newRole: RolePayload) {
    try {
      const role = await this.postRole(newRole);
      this._roles.set([...this._roles(), role]);
    } catch (error) {
      console.error(`Error creating user role: ${error}`);
    }
  }

  async updateRole(updateRole: UpdateRolePayload) {
    try {
      const { id, ...rolePayload } = updateRole;

      const role = await this.putRole(id, rolePayload);

      const updatedIndex = this._roles().findIndex((item) => item.id === id);
      const updatedRoles: RoleCode[] = [...this._roles().filter((item) => item.id !== id)];
      updatedRoles.splice(updatedIndex, 0, role);

      this._roles.set(updatedRoles);
    } catch (error) {
      console.error(`Error updating user role: ${error}`);
    }
  }

  async removeRole(id: number) {
    try {
      const deleteResponse = await this.deleteRole(id);

      if (deleteResponse.success) {
        this._roles.set([...this._roles().filter((item) => item.id !== deleteResponse.id)]);
      }
    } catch (error) {
      console.error(`Error removing user role: ${error}`);
    }
  }

  // *** RIGHTS ***
  async loadRights() {
    try {
      const rights = await this.getRights();
      this._rights.set(rights);
    } catch (error) {
      console.error(`Error fetching user rights: ${error}`);
    }
  }

  async addRight(newRight: RightPayload) {
    try {
      const right = await this.postRight(newRight);
      this._rights.set([...this._rights(), right]);
    } catch (error) {
      console.error(`Error creating user right: ${error}`);
    }
  }

  async updateRight(updateRight: UpdateRightPayload) {
    try {
      const { id, ...rightPayload } = updateRight;

      const right = await this.putRight(id, rightPayload);

      const updatedIndex = this._rights().findIndex((item) => item.id === id);
      const updatedRights: RightCode[] = [...this._rights().filter((item) => item.id !== id)];
      updatedRights.splice(updatedIndex, 0, right);

      this._rights.set(updatedRights);
    } catch (error) {
      console.error(`Error updating user right: ${error}`);
    }
  }

  async removeRight(id: number) {
    try {
      const deleteResponse = await this.deleteRight(id);

      if (deleteResponse.success) {
        this._rights.set([...this._rights().filter((item) => item.id !== deleteResponse.id)]);
      }
    } catch (error) {
      console.error(`Error removing user right: ${error}`);
    }
  }

  // *** PRIVATE USER FUNCTIONS ***
  private async getUsers() {
    const users$ = this.tokenService.getWithTokenRefresh<UserCode[]>('/account-management/users');
    return firstValueFrom(users$);
  }

  private async postUser(userPayload: UserPayload) {
    const user$ = this.tokenService.postWithTokenRefresh<UserCode>('/account-management/users', userPayload);
    return firstValueFrom(user$);
  }

  private async putUser(id: number, userPayload: UserPayload) {
    const user$ = this.tokenService.putWithTokenRefresh<UserCode>(`/account-management/users/${id}`, userPayload);
    return firstValueFrom(user$);
  }

  private async deleteUser(id: number) {
    const deleteResponse$ = this.tokenService.deleteWithTokenRefresh<DeleteResponse>(`/account-management/users/${id}`);
    return firstValueFrom(deleteResponse$);
  }

  // *** PRIVATE ROLE FUNCTIONS ***
  private async getRoles() {
    const roles$ = this.tokenService.getWithTokenRefresh<RoleCode[]>('/account-management/roles');
    return firstValueFrom(roles$);
  }

  private async postRole(rolePayload: RolePayload) {
    const newRole$ = this.tokenService.postWithTokenRefresh<RoleCode>('/account-management/roles', rolePayload);
    return firstValueFrom(newRole$);
  }

  private async putRole(id: number, rolePayload: RightPayload) {
    const role$ = this.tokenService.putWithTokenRefresh<RoleCode>(`/account-management/roles/${id}`, rolePayload);
    return firstValueFrom(role$);
  }

  private async deleteRole(id: number) {
    const deleteResponse$ = this.tokenService.deleteWithTokenRefresh<DeleteResponse>(`/account-management/roles/${id}`);
    return firstValueFrom(deleteResponse$);
  }

  // *** PRIVATE RIGHT FUNCTIONS ***
  private async getRights() {
    const rights$ = this.tokenService.getWithTokenRefresh<RightCode[]>('/account-management/rights');
    return firstValueFrom(rights$);
  }

  private async postRight(rightPayload: RightPayload) {
    const newRight$ = this.tokenService.postWithTokenRefresh<RightCode>('/account-management/rights', rightPayload);
    return firstValueFrom(newRight$);
  }

  private async putRight(id: number, rightPayload: RightPayload) {
    const right$ = this.tokenService.putWithTokenRefresh<RightCode>(`/account-management/rights/${id}`, rightPayload);
    return firstValueFrom(right$);
  }

  private async deleteRight(id: number) {
    const deleteResponse$ = this.tokenService.deleteWithTokenRefresh<DeleteResponse>(`/account-management/rights/${id}`);
    return firstValueFrom(deleteResponse$);
  }
}
