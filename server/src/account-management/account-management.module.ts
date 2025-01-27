import { Module } from '@nestjs/common';
import { AccountManagementService } from './account-management.service';
import { AccountManagementController } from './account-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { RoleEntity } from './entities/role.entity';
import { RightEntity } from './entities/right.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, RightEntity])],
  controllers: [AccountManagementController],
  providers: [AccountManagementService],
})
export class AccountManagementModule {}
