import { Injectable, UnauthorizedException, ForbiddenException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SettingEntity } from 'src/entities/settings.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';
import { AuthPayload, AuthResponse, RegistrationInfo, LoginCredentials } from './authentication.model';
import {
  CREATION_CODE_FIELD,
  CREATION_CODE_LENGTH,
  INVALID_CREATION_CODE,
  INVALID_CREDENTIALS,
  INVALID_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRED,
  USERNAME_TAKEN,
} from 'src/constants';
import { UserLogService } from 'src/common/services/user-log/user-log.service';

@Injectable()
export class AuthenticationService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,

    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,

    private readonly userLogService: UserLogService,
    private readonly jwtService: JwtService
  ) {}

  async onModuleInit() {
    // Create or Refresh Creation Code on startup
    const creationCode = this.generateCreationCode();

    await this.settingRepository.save({
      key: CREATION_CODE_FIELD,
      value: creationCode,
    }); 
  }

  /**
   *
   * @param loginDto Function to log in a user
   * @returns authentication info on success or Unauthorized Exception on failure
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Check Valid Credentials
    if (!credentials || !credentials.username || !credentials.password) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    const username = credentials.username.toLowerCase();
    const password = credentials.password;

    // Check User
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    // Check Password Match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    this.userLogService.logUserLogin(user.id);
    return this.generateAuthInfo(user.id);
  }

  /**
   * Function to logout user
   * @param userId is the ID for the given user
   */
  async logout(userId: number, refreshToken?: string) {
    // Delete refresh token
    if (refreshToken) {
      const jti = this.getTokenJti(refreshToken);

      if (jti) {
        await this.refreshTokenRepository.delete({ jti });
      }
    }

    this.userLogService.logUserLogout(userId);
  }

  async register(registrationInfo: RegistrationInfo): Promise<AuthResponse> {
    // Check creation code
    const creationCode = await this.settingRepository.findOne({
      select: ['value'],
      where: { key: CREATION_CODE_FIELD },
    });

    if (!creationCode || registrationInfo.creationCode !== creationCode.value) {
      throw new ForbiddenException(INVALID_CREATION_CODE);
    }

    const username = registrationInfo.username.toLowerCase();

    // Check for username in use
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException(USERNAME_TAKEN);
    }

    // Create User Account
    const hashedPassword = await bcrypt.hash(registrationInfo.password, 10);

    const user = await this.userRepository.save({
      username,
      password: hashedPassword,
      lastLogin: Date(),
    });

    const authInfo = await this.generateAuthInfo(user.id);

    return authInfo;
  }

  async refresh(oldRefreshToken: string) {
    if (!oldRefreshToken) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    const oldJti = this.getTokenJti(oldRefreshToken);
    if (!oldJti) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { jti: oldJti },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    if (refreshToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.remove(refreshToken);
      throw new UnauthorizedException(REFRESH_TOKEN_EXPIRED);
    }

    const userId = refreshToken.user.id;
    if (!userId) {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN);
    }

    await this.refreshTokenRepository.remove(refreshToken);

    this.userLogService.logUserRefresh(userId);
    return this.generateAuthInfo(userId);
  }

  /**
   * Function to generate auth info for given user
   * @param userId is the id of the given user
   * @returns Auth Info on success or null on failure
   */
  private async generateAuthInfo(userId: number): Promise<AuthResponse | null> {
    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'username', 'roles', 'active'],
      where: { id: userId },
      relations: ['roles', 'roles.rights'],
    });

    if (!user || !user.active) {
      return null;
    }

    const jti = uuidv4();

    const payload: AuthPayload = {
      sub: user.id,
      name: user.name,
      username: user.username,
      roles: user.roles.map((role) => ({
        id: role.id,
        name: role.name,
      })),
      rights: user.roles.flatMap((role) =>
        role.rights.map((right) => ({
          internalName: right.internalName,
          id: right.id,
        }))
      ),
      jti,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // Set to 1h
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await this.refreshTokenRepository.save({
      jti,
      user: { id: user.id },
      token: hashedToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 day expiration
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }

  private getTokenJti(token: string): string | null {
    if (!token) {
      return null;
    }

    try {
      const payload: AuthPayload = this.jwtService.verify(token);
      return payload.jti;
    } catch (error) {
      return null;
    }
  }

  private generateCreationCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let result = '';
    for (let i = 0; i < CREATION_CODE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  }
}
