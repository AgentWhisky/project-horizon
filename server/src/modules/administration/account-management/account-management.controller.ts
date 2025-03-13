import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { AccountManagementService } from './account-management.service';
import { RoleDto } from './dto/role.dto';
import { UserDto } from './dto/user.dto';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import { CacheUtils } from 'src/common/utils/cache.utils';
import { CACHE_KEY } from 'src/common/constants/cache-keys.constants';
import { USER_RIGHTS } from 'src/common/constants/user-rights.constants';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { RightResponseDto } from './dto/right-response.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { UserActiveDto } from './dto/toggle-user.dto';

@ApiTags('Account Management')
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiOkResponse({ description: 'List of all users', type: [UserResponseDto] })
  async getUsers(): Promise<UserResponseDto[]> {
    return this.accountManagementService.getUsers();
  }

  @Put('users/:id')
  @RequireRight(USER_RIGHTS.MANAGE_USERS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user details' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UserDto })
  @ApiCreatedResponse({ description: 'Updated user information', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto): Promise<UserResponseDto> {
    const user = await this.accountManagementService.updateUser(id, userDto);
    await this.cacheUtils.clearUserCache();
    return user;
  }

  @Put('users/:id/active')
  @RequireRight(USER_RIGHTS.MANAGE_USERS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user active status' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({ type: UserActiveDto })
  @ApiCreatedResponse({ description: 'Updated user active status', type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateUserActive(@Param('id', ParseIntPipe) id: number, @Body() body: UserActiveDto): Promise<UserResponseDto> {
    const user = await this.accountManagementService.updateUserActive(id, body.active);
    await this.cacheUtils.clearUserCache();
    return user;
  }

  // *** ROLES ***
  @Get('roles')
  @RequireRight(USER_RIGHTS.MANAGE_USERS, USER_RIGHTS.MANAGE_ROLES)
  @CacheKey(CACHE_KEY.ACCOUNT_MANAGEMENT_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user roles' })
  @ApiOkResponse({ description: 'List of user roles', type: [RoleResponseDto] })
  async getRoles(): Promise<RoleResponseDto[]> {
    return this.accountManagementService.getRoles();
  }

  @Post('roles')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({ description: 'Role successfully created', type: RoleResponseDto })
  async addRoles(@Body() roleDto: RoleDto): Promise<RoleResponseDto> {
    const role = await this.accountManagementService.addRole(roleDto);
    await this.cacheUtils.clearRoleCache();
    return role;
  }

  @Put('roles/:id')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing role' })
  @ApiCreatedResponse({ description: 'Role updated successfully', type: RoleDto })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async updateRoles(@Param('id', ParseIntPipe) id: number, @Body() roleDto: RoleDto) {
    const role = await this.accountManagementService.updateRole(id, roleDto);
    await this.cacheUtils.clearRoleCache();
    return role;
  }

  @Delete('roles/:id')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a role' })
  @ApiOkResponse({ description: 'Role deleted successfully' })
  async deleteRoles(@Param('id', ParseIntPipe) id: number) {
    const deleteResponse = await this.accountManagementService.deleteRole(id);
    await this.cacheUtils.clearRoleCache();
    return deleteResponse;
  }

  // *** RIGHTS ***
  @Get('rights')
  @RequireRight(USER_RIGHTS.MANAGE_USERS, USER_RIGHTS.MANAGE_ROLES)
  @CacheKey(CACHE_KEY.ACCOUNT_MANAGEMENT_RIGHTS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user rights' })
  @ApiOkResponse({ description: 'List of user rights', type: [RightResponseDto] })
  async getRights() {
    return this.accountManagementService.getRights();
  }
}
