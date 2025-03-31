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
import { UserLogService } from 'src/common/services/user-log/user-log.service';
import { generateCode } from 'src/common/utils/generate-codes.utils';
import {
  INVALID_CREATION_CODE,
  INVALID_REFRESH_TOKEN,
  LOGIN_ERROR,
  REFRESH_TOKEN_EXPIRED,
  USERNAME_TAKEN,
} from 'src/common/constants/error-response.constants';
import { CREATION_CODE_FIELD, CREATION_CODE_LENGTH } from 'src/common/constants/creation-code.constants';

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
    this.refreshCreationCode();
  }

  /**
   *
   * @param loginDto Function to log in a user
   * @returns authentication info on success or Unauthorized Exception on failure
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Check Valid Credentials
    if (!credentials || !credentials.username || !credentials.password) {
      throw new UnauthorizedException(LOGIN_ERROR.INVALID_CREDENTIALS);
    }

    const username = credentials.username.toLowerCase();
    const password = credentials.password;

    // Check User
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException(LOGIN_ERROR.INVALID_CREDENTIALS);
    }

    if (!user.active) {
      throw new ForbiddenException(LOGIN_ERROR.ACCOUNT_DISABLED);
    }

    // Check Password Match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(LOGIN_ERROR.INVALID_CREDENTIALS);
    }

    // Update last login time
    await this.userRepository.save({
      id: user.id,
      lastLogin: Date(),
    });

    this.userLogService.logUserLogin(user.id);
    return this.generateAuthInfo(user.id);
  }

  /**
   * Function to logout user
   * @param userId is the ID for the given user
   */
  async logout(authToken: string) {
    const { sub: userId, jti } = this.jwtService.verify<AuthPayload>(authToken);

    // Delete refresh token
    if (jti) {
      const refreshToken = await this.refreshTokenRepository.findOne({
        where: { jti },
        relations: ['user'],
      });

      if (refreshToken && refreshToken.user.id === userId) {
        await this.refreshTokenRepository.delete({ jti });
      }
    }

    this.userLogService.logUserLogout(userId);
  }

  async register(registrationInfo: RegistrationInfo): Promise<AuthResponse> {
    // Check creation code
    const creationCode = await this.settingRepository.findOne({
      select: { value: true },
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
      name: registrationInfo.name,
      username,
      password: hashedPassword,
      lastLogin: Date(),
    });

    this.userLogService.logUserCreateAccount(user.id);
    this.refreshCreationCode();
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
      select: { id: true, name: true, username: true, roles: { id: true, rights: true }, active: true },
      where: { id: userId },
      relations: { roles: { rights: true } },
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
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: 3600,
      tokenType: 'Bearer',
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

  private async refreshCreationCode() {
    const creationCode = generateCode(CREATION_CODE_LENGTH);

    await this.settingRepository.save({
      key: CREATION_CODE_FIELD,
      value: creationCode,
    });
  }
}
