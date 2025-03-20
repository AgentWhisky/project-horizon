import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { AccountManagementService } from './account-management.service';
import { RoleDto } from './dto/role.dto';
import { UserDto } from './dto/user.dto';
import { RequireRight } from 'src/decorators/require-right.decorator';
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
export class AccountManagementController {
  constructor(
    private readonly accountManagementService: AccountManagementService,
  ) {}

  // *** USERS ***
  @Get('users')
  @RequireRight(USER_RIGHTS.MANAGE_USERS)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiOkResponse({ description: 'List of all users', type: [UserResponseDto] })
  async getUsers(): Promise<UserResponseDto[]> {
    console.log('USERS');
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
    return this.accountManagementService.updateUser(id, userDto);
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
    return this.accountManagementService.updateUserActive(id, body.active);
  }

  // *** ROLES ***
  @Get('roles')
  @RequireRight(USER_RIGHTS.MANAGE_USERS, USER_RIGHTS.MANAGE_ROLES)
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
    return this.accountManagementService.addRole(roleDto);
  }

  @Put('roles/:id')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing role' })
  @ApiCreatedResponse({ description: 'Role updated successfully', type: RoleDto })
  @ApiNotFoundResponse({ description: 'Role not found' })
  async updateRoles(@Param('id', ParseIntPipe) id: number, @Body() roleDto: RoleDto) {
    return this.accountManagementService.updateRole(id, roleDto);
  }

  @Delete('roles/:id')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a role' })
  @ApiOkResponse({ description: 'Role deleted successfully' })
  async deleteRoles(@Param('id', ParseIntPipe) id: number) {
    return this.accountManagementService.deleteRole(id);
  }

  // *** RIGHTS ***
  @Get('rights')
  @RequireRight(USER_RIGHTS.MANAGE_USERS, USER_RIGHTS.MANAGE_ROLES)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user rights' })
  @ApiOkResponse({ description: 'List of user rights', type: [RightResponseDto] })
  async getRights() {
    return this.accountManagementService.getRights();
  }
}
