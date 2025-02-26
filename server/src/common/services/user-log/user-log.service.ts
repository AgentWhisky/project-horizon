import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLogEntity } from 'src/entities/user-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserLogService {
  constructor(
    @InjectRepository(UserLogEntity)
    private readonly userLogRepository: Repository<UserLogEntity>
  ) {}

  async logUserLogin(userId: number) {
    if (!userId) {
      return;
    }

    try {
      await this.userLogRepository.save({
        userId,
        action: 'LOGIN',
      });
    } catch (error) {
      console.error(`Failed to log user login: ${error}`);
    }
  }

  async logUserLogout(userId: number) {
    if (!userId) {
      return;
    }

    try {
      await this.userLogRepository.save({
        userId,
        action: 'LOGOUT',
      });
    } catch (error) {
      console.error(`Failed to log user logout: ${error}`);
    }
  }

  async logUserCreateAccount(userId: number) {
    if (!userId) {
      return;
    }

    try {
      await this.userLogRepository.save({
        userId,
        action: 'CREATE ACCOUNT',
      });
    } catch (error) {
      console.error(`Failed to log user account creation: ${error}`);
    }
  }

  async logUserRefresh(userId: number) {
    if (!userId) {
      return;
    }

    try {
      await this.userLogRepository.save({
        userId,
        action: 'REFRESH',
      });
    } catch (error) {
      console.error(`Failed to log user refresh: ${error}`);
    }
  }
}
