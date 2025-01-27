import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { UserData, UserResponse } from './account-management.type';
import { RightEntity } from './entities/right.entity';
import { RightDto, RightResponseDto } from './dto/right.dto';

@Injectable()
export class AccountManagementService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RightEntity)
    private readonly rightRepository: Repository<RightEntity>
  ) {}

  async getUsers() {
    const users: UserResponse[] = await this.userRepository.find({
      select: ['id', 'name', 'email', 'roles', 'active', 'lastLogin'],
      relations: ['roles'],
    });

    return users.sort((a, b) => a.id - b.id);
  }

  async addUser(user: UserData) {
    const newLink = await this.userRepository.save({
      name: user.name,
      email: user.email,
      roles: user.roles.map((id) => ({ id })),
    });

    return await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'roles', 'active', 'lastLogin'],
      where: { id: newLink.id },
      relations: ['roles'],
    });
  }

  async updateUser(id: number, user: UserData) {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new HttpException(`User with ID: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.userRepository.save({
      id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((id) => ({ id })),
    });

    return await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'roles', 'active', 'lastLogin'],
      where: { id },
      relations: ['roles'],
    });
  }

  async deleteUser(id: number) {
    const deleteResult = await this.userRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }

  // *** RIGHTS ***
  async getRights() {
    const rights: RightResponseDto[] = await this.rightRepository.find({
      select: ['id', 'name', 'description', 'internalName', 'active'],
    });

    return rights.sort((a, b) => a.id - b.id);
  }

  async addRight(rightDto: RightDto) {
    const name = rightDto.name;
    const internalName = name.trim().toUpperCase().replace(/\s+/g, '_'); // Generate Internal Name

    const newRight = await this.rightRepository.save({
      name,
      internalName,
      description: rightDto.description,
    });

    const right = await this.rightRepository.findOne({
      select: ['id', 'name', 'description', 'internalName', 'active'],
      where: { id: newRight.id },
    });

    return {
      ...right,
      inUse: false,
    };
  }

  async updateRight(id: number, rightDto: RightDto) {
    const existingRight = await this.rightRepository.findOne({ where: { id } });

    if (!existingRight) {
      throw new HttpException(`Right with ID: ${id} not found`, HttpStatus.NOT_FOUND);
    }

    await this.rightRepository.save({
      id,
      name: rightDto.description,
      description: rightDto.description,
    });

    return await this.rightRepository.findOne({
      select: ['id', 'name', 'description', 'internalName', 'active'],
      where: { id },
    });
  }

  async deleteRight(id: number) {
    const deleteResult = await this.rightRepository.delete(id);

    return {
      success: deleteResult.affected === 1,
      id,
    };
  }
}
