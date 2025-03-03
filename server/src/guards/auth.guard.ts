import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthPayload } from 'src/authentication/authentication.model';
import { UserEntity } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requredRight = this.reflector.get<string>('right', context.getHandler());
    if (!requredRight) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1];

      const payload: AuthPayload = this.jwtService.verify(token);
      if (!payload || !payload.sub) {
        throw new ForbiddenException();
      }

      const user = await this.userRepository.findOne({
        select: ['id', 'roles', 'active'],
        where: { id: payload.sub },
        relations: ['roles', 'roles.rights'],
      });

      if (!user || !user.active || !user.roles) {
        throw new ForbiddenException();
      }
      
      const userRights = user.roles.flatMap((role) => role.rights.map((right) => right.internalName));

      if (!userRights.includes(requredRight)) {
        throw new ForbiddenException();
      }

      return true;
    } catch {
      throw new ForbiddenException();
    }
  }
}
