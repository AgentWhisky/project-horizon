import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserEntity } from 'src/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { SettingEntity } from 'src/entities/settings.entity';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { RefreshTokenEntity } from 'src/entities/refresh-token.entity';
import { UserLogModule } from 'src/common/services/user-log/user-log.module';
import { RightEntity } from 'src/entities/right.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, SettingEntity, RefreshTokenEntity, RightEntity]),
    CacheModule.register(),
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_SECRET,
      signOptions: { expiresIn: '60s', algorithm: 'HS256' },
    }),
    ScheduleModule.forRoot(),
    UserLogModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
