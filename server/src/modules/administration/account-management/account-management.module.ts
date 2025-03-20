import { Module } from '@nestjs/common';
import { AccountManagementService } from './account-management.service';
import { AccountManagementController } from './account-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/users.entity';
import { RoleEntity } from 'src/entities/role.entity';
import { RightEntity } from 'src/entities/right.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, RightEntity])],
  controllers: [AccountManagementController],
  providers: [AccountManagementService],
})
export class AccountManagementModule {}
