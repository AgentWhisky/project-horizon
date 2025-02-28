import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from 'db/data-source';
import { LinkLibraryModule } from './modules/link-library/link-library.module';
import { AccountManagementModule } from './account-management/account-management.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { InitializationModule } from './initialization/initilaization.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    InitializationModule,
    MaintenanceModule,
    LinkLibraryModule,
    AccountManagementModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
