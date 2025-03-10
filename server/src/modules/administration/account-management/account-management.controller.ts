import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { AccountManagementService } from './account-management.service';
import { RoleDto } from './dto/role.dto';
import { UserDto } from './dto/user.dto';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheUtils } from 'src/common/utils/cache.utils';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';

@Controller('account-management')
@UseInterceptors(CacheInterceptor)
export class AccountManagementController {
  constructor(
    private readonly accountManagementService: AccountManagementService,
    private readonly cacheUtils: CacheUtils
  ) {}

  // *** USERS ***
  @Get('users')
  @RequireRight(USER_RIGHTS.MANAGE_USERS)
  @CacheKey(CACHE_KEY.ACCOUNT_MANAGEMENT_USERS)
  async getUsers() {
    return this.accountManagementService.getUsers();
  }

  @Put('users/:id')
  @RequireRight(USER_RIGHTS.MANAGE_USERS)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto) {
    const user = await this.accountManagementService.updateUser(id, userDto);
    await this.cacheUtils.clearUserCache();
    return user;
  }

  @Put('users/:id/active')
  @RequireRight(USER_RIGHTS.MANAGE_USERS)
  async updateUserActive(@Param('id', ParseIntPipe) id: number, @Body() body: { active: boolean }) {
    const user = await this.accountManagementService.updateUserActive(id, body.active);
    await this.cacheUtils.clearUserCache();
    return user;
  }

  // *** ROLES ***
  @Get('roles')
  @RequireRight(USER_RIGHTS.MANAGE_USERS, USER_RIGHTS.MANAGE_ROLES)
  @CacheKey(CACHE_KEY.ACCOUNT_MANAGEMENT_ROLES)
  async getRoles() {
    return this.accountManagementService.getRoles();
  }

  @Post('roles')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  async addRoles(@Body() roleDto: RoleDto) {
    const role = await this.accountManagementService.addRole(roleDto);
    await this.cacheUtils.clearRoleCache();
    return role;
  }

  @Put('roles/:id')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  async updateRoles(@Param('id', ParseIntPipe) id: number, @Body() roleDto: RoleDto) {
    const role = await this.accountManagementService.updateRole(id, roleDto);
    await this.cacheUtils.clearRoleCache();
    return role;
  }

  @Delete('roles/:id')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  async deleteRoles(@Param('id', ParseIntPipe) id: number) {
    const deleteResponse = await this.accountManagementService.deleteRole(id);
    await this.cacheUtils.clearRoleCache();
    return deleteResponse;
  }

  // *** RIGHTS ***
  @Get('rights')
  @RequireRight(USER_RIGHTS.MANAGE_USERS, USER_RIGHTS.MANAGE_ROLES)
  @CacheKey(CACHE_KEY.ACCOUNT_MANAGEMENT_RIGHTS)
  async getRights() {
    return this.accountManagementService.getRights();
  }
}
