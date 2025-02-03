import {
  Inject,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { ILike, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { SettingEntity } from 'src/entities/settings.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,

    private jwtService: JwtService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Check Valid Credentials
    if (!loginDto || !loginDto.username || !loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check User
    const user = await this.userRepository.findOne({
      where: { username: ILike(loginDto.username) },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check Password Match
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const authInfo = this.getAuthInfo(user.id);

    if (!authInfo) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return authInfo;
  }

  async createAccount(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Check creation code
    const creationCode = await this.settingRepository.findOne({
      select: ['value'],
      where: { setting: 'creation-code' },
    });

    if (!creationCode || registerDto.creationCode !== creationCode.value) {
      throw new ForbiddenException('Invalid Creation Code');
    }

    // Check for username in use
    const existingUser = await this.userRepository.findOne({
      where: { username: ILike(registerDto.username) },
    });

    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }

    // Create User Account
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.userRepository.save({
      username: registerDto.username,
      password: hashedPassword,
      lastLogin: Date(),
    });

    const authInfo = await this.getAuthInfo(user.id);

    if (!authInfo) {
      throw new ConflictException('Username is already taken');
    }

    return authInfo;
  }

  // *** PRIVATE FUNCTIONS ***
  private async getAuthInfo(id: number): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      select: ['id', 'name', 'username', 'roles', 'active'],
      where: { id },
      relations: ['roles', 'roles.rights'],
    });

    if (!user.active) {
      throw new InternalServerErrorException('Failed to register user');
    }

    const payload = {
      name: user.name,
      username: user.username,
      rights: user.roles.flatMap((role) =>
        role.rights.map((right) => ({
          internalName: right.internalName,
          id: right.id,
        }))
      ),
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      expiresIn: 3600,
      tokenType: 'Bearer',
    };
  }
}
