import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';
import { REQUIRE_RIGHTS_KEY } from 'src/common/decorators/require-right.decorator';
import { UserEntity } from 'src/entities/users.entity';
import { AuthPayload } from 'src/modules/authentication/authentication.model';
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
    const requiredRights = this.reflector.get<string[]>(REQUIRE_RIGHTS_KEY, context.getHandler());

    if (!requiredRights) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();

      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Authorization token is required');
      }

      const payload: AuthPayload = this.jwtService.verify(token);
      if (!payload) {
        throw new UnauthorizedException('Authorization token is invalid or expired');
      }

      if (!payload.sub) {
        throw new UnauthorizedException('Token payload is malformed or missing subject');
      }

      // Check if the only right is DEFAULT (Require Auth Token Only)
      if (requiredRights.every((item) => item === USER_RIGHTS.DEFAULT)) {
        return true;
      }

      const user = await this.userRepository.findOne({
        select: { id: true, roles: { id: true, rights: true }, active: true },
        where: { id: payload.sub },
        relations: { roles: { rights: true } },
      });

      if (!user || !user.active || !user.roles) {
        throw new ForbiddenException('Access denied: user not found, inactive, or improperly configured');
      }

      const userRights = user.roles.flatMap((role) => role.rights.map((right) => right.internalName));

      const hasRequiredRight = requiredRights.some((right) => userRights.includes(right));

      if (!hasRequiredRight) {
        throw new ForbiddenException('Insufficient permissions for this action');
      }

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Authorization token has expired');
      }

      throw new UnauthorizedException('Authentication failed due to an unexpected error');
    }
  }
}
