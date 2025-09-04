import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from 'db/data-source';
import { JobsModule } from './jobs/jobs.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserEntity } from './entities/users.entity';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { AdminDashboardModule } from './modules/administration/admin-dashboard/admin-dashboard.module';
import { AccountManagementModule } from './modules/administration/account-management/account-management.module';
import { LinkLibraryModule } from './modules/libraries/link-library/link-library.module';
import { LinkLibraryManagementModule } from './modules/administration/link-library-management/link-library-management.module';
import { CacheModule } from '@nestjs/cache-manager';
import { SteamInsightModule } from './modules/tools/steam-insight/steam-insight.module';
import { SteamInsightManagementModule } from './modules/administration/steam-insight-management/steam-insight-management.module';
import { AuthGuard } from './common/guards';

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),
    TypeOrmModule.forFeature([UserEntity]),
    CacheModule.register({
      ttl: 60000 * 15,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 60,
        },
      ],
    }),
    JobsModule,
    AuthenticationModule,
    AdminDashboardModule,
    AccountManagementModule,
    LinkLibraryManagementModule,
    SteamInsightManagementModule,
    LinkLibraryModule,
    SteamInsightModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
