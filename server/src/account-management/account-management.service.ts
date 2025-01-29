import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { RightEntity } from '../entities/right.entity';
import { RightDto, RightResponseDto } from './dto/right.dto';
import { RoleDto, RoleResponseDto } from './dto/role.dto';
import { DeleteResponseDto } from 'src/common/dto/deletion-response.dto';
import { RoleEntity } from '../entities/role.entity';
import { UserDto, UserResponseDto } from './dto/user.dto';

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

  async getUsers(): Promise<UserResponseDto[]> {
    const dbUsers = await this.userRepository.find({
      select: ['id', 'name', 'email', 'roles', 'active', 'lastLogin'],
      relations: ['roles'],
    });

    const users: UserResponseDto[] = dbUsers
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        lastLogin: user.lastLogin,
        roles: user.roles.map((right) => ({
          id: right.id,
          name: right.name,
          description: right.description,
        })),
      }))
      .sort((a, b) => a.id - b.id);

    return users;
  }

  async addUser(userDto: UserDto): Promise<UserResponseDto> {
    const newUser = await this.userRepository.save({
      name: userDto.name,
      email: userDto.email,
      roles: userDto.roles.map((id) => ({ id })),
    });

    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'roles', 'active', 'lastLogin'],
      relations: ['roles'],
      where: [{ id: newUser.id }],
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      lastLogin: user.lastLogin,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })),
    };
  }

  async updateUser(id: number, userDto: UserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new HttpException(`User with ID: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.userRepository.save({
      id,
      name: userDto.name,
      email: userDto.email,
      roles: userDto.roles.map((id) => ({ id })),
    });

    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'roles', 'active', 'lastLogin'],
      relations: ['roles'],
      where: [{ id }],
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      lastLogin: user.lastLogin,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
      })),
    };
  }

  async deleteUser(id: number): Promise<DeleteResponseDto> {
    const deleteResult = await this.userRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }

  async updateUserActive(id: number, active: boolean) {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new HttpException(`User with ID: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.userRepository.save({
      id,
      active,
    });

    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'roles', 'active', 'lastLogin'],
      relations: ['roles'],
      where: [{ id }],
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
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
  async getRoles(): Promise<RoleResponseDto[]> {
    const dbRoles = await this.roleRepository.find({
      select: ['id', 'name', 'description', 'rights'],
      relations: ['rights'],
    });

    const roles: RoleResponseDto[] = dbRoles
      .map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        rights: role.rights.map((right) => ({
          id: right.id,
          name: right.name,
          description: right.description,
        })),
      }))
      .sort((a, b) => a.id - b.id);

    return roles;
  }

  async addRole(roleDto: RoleDto): Promise<RoleResponseDto> {
    const newRole = await this.roleRepository.save({
      name: roleDto.name,
      description: roleDto.description,
      rights: roleDto.rights.map((id) => ({ id })),
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

  async updateRole(id: number, roleDto: RoleDto): Promise<RoleResponseDto> {
    const existingRole = await this.roleRepository.findOne({ where: { id } });

    if (!existingRole) {
      throw new HttpException(`Role with ID: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.roleRepository.save({
      id,
      name: roleDto.name,
      description: roleDto.description,
      rights: roleDto.rights.map((id) => ({ id })),
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

  async deleteRole(id: number): Promise<DeleteResponseDto> {
    const deleteResult = await this.roleRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }

  // *** RIGHTS ***
  async getRights(): Promise<RightResponseDto[]> {
    const dbRights = await this.rightRepository.find({
      select: ['id', 'name', 'description', 'internalName'],
      relations: ['roles'],
    });

    const rights: RightResponseDto[] = dbRights
      .map((right) => ({
        id: right.id,
        name: right.name,
        description: right.description,
        internalName: right.internalName,
        inUse: !!right.roles?.length,
      }))
      .sort((a, b) => a.id - b.id);

    return rights;
  }

  async addRight(rightDto: RightDto): Promise<RightResponseDto> {
    const name = rightDto.name;
    const internalName = name.trim().toUpperCase().replace(/\s+/g, '_'); // Generate Internal Name

    const newRight = await this.rightRepository.save({
      name,
      internalName,
      description: rightDto.description,
    });

    const right = await this.rightRepository.findOne({
      select: ['id', 'name', 'description', 'internalName'],
      where: { id: newRight.id },
    });

    return {
      ...right,
      inUse: false,
    };
  }

  async updateRight(id: number, rightDto: RightDto): Promise<RightResponseDto> {
    const existingRight = await this.rightRepository.findOne({ where: { id } });

    if (!existingRight) {
      throw new HttpException(`Right with ID: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.rightRepository.save({
      id,
      name: rightDto.name,
      description: rightDto.description,
    });

    const right = await this.rightRepository.findOne({
      select: ['id', 'name', 'description', 'internalName'],
      where: { id },
      relations: ['roles'],
    });

    return {
      id: right.id,
      name: right.name,
      description: right.description,
      internalName: right.internalName,
      inUse: !!right.roles?.length,
    };
  }

  async deleteRight(id: number): Promise<DeleteResponseDto> {
    const deleteResult = await this.rightRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }
}
