import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { RoleEntity } from 'src/entities/role.entity';
import { RightEntity } from 'src/entities/right.entity';
import { UserPayload, User, Role, RolePayload, Right } from './account-management.model';
import { DeleteResponse } from 'src/common/model/delete-response.model';

@Injectable()
export class AccountManagementService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(RightEntity)
    private readonly rightRepository: Repository<RightEntity>
  ) {}

  // *** USERS ***
  async getUsers(): Promise<User[]> {
    const dbUsers = await this.userRepository.find({
      select: ['id', 'name', 'username', 'roles', 'active', 'lastLogin'],
      relations: ['roles'],
      order: { id: 'ASC' },
    });

    const users: User[] = dbUsers.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      active: user.active,
      lastLogin: user.lastLogin,
      roles: user.roles.map((right) => ({
        id: right.id,
        name: right.name,
        description: right.description,
      })),
    }));

    return users;
  }

  async updateUser(id: number, userPayload: UserPayload): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    await this.userRepository.save({
      id,
      name: userPayload.name,
      roles: userPayload.roles.map((id) => ({ id })),
    });

    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'username', 'roles', 'active', 'lastLogin'],
      relations: ['roles'],
      where: [{ id }],
    });

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      active: user.active,
      lastLogin: user.lastLogin,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })),
    };
  }

  async updateUserActive(id: number, active: boolean) {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    await this.userRepository.save({
      id,
      active,
    });

    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'username', 'roles', 'active', 'lastLogin'],
      relations: ['roles'],
      where: [{ id }],
    });

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      active: user.active,
      lastLogin: user.lastLogin,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })),
    };
  }

  // *** ROLES ***
  async getRoles(): Promise<Role[]> {
    const dbRoles = await this.roleRepository.find({
      select: ['id', 'name', 'description', 'rights'],
      relations: ['rights'],
      order: { id: 'ASC' },
    });

    const roles: Role[] = dbRoles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      rights: role.rights.map((right) => ({
        id: right.id,
        name: right.name,
        description: right.description,
      })),
    }));

    return roles;
  }

  async addRole(rolePayload: RolePayload): Promise<Role> {
    const newRole = await this.roleRepository.save({
      name: rolePayload.name,
      description: rolePayload.description,
      rights: rolePayload.rights.map((id) => ({ id })),
    });

    const role = await this.roleRepository.findOne({
      select: ['id', 'name', 'description', 'rights'],
      relations: ['rights'],
      where: [{ id: newRole.id }],
    });

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      rights: role.rights.map((right) => ({
        id: right.id,
        name: right.name,
        description: right.description,
      })),
    };
  }

  async updateRole(id: number, rolePayload: RolePayload): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ where: { id } });

    if (!existingRole) {
      throw new NotFoundException(`Role with ID: ${id} not found`)
    }

    await this.roleRepository.save({
      id,
      name: rolePayload.name,
      description: rolePayload.description,
      rights: rolePayload.rights.map((id) => ({ id })),
    });

    const role = await this.roleRepository.findOne({
      select: ['id', 'name', 'description', 'rights'],
      relations: ['rights'],
      where: [{ id }],
    });

    return {
      id: role.id,
      name: role.name,
      description: role.description,
      rights: role.rights.map((right) => ({
        id: right.id,
        name: right.name,
        description: right.description,
      })),
    };
  }

  async deleteRole(id: number): Promise<DeleteResponse> {
    const deleteResult = await this.roleRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }

  // *** RIGHTS ***
  async getRights(): Promise<Right[]> {
    const dbRights = await this.rightRepository.find({
      select: ['id', 'name', 'description', 'internalName'],
      relations: ['roles'],
      order: { id: 'ASC' },
    });

    const rights: Right[] = dbRights.map((right) => ({
      id: right.id,
      name: right.name,
      description: right.description,
      internalName: right.internalName,
      inUse: !!right.roles?.length,
    }));

    return rights;
  }
}
