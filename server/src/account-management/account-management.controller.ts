import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AccountManagementService } from './account-management.service';
import { RoleDto } from './dto/role.dto';
import { UserDto } from './dto/user.dto';
import { RequireRight } from 'src/decorators/require-right.decorator';
import { USER_RIGHTS } from 'src/constants';

@Controller('account-management')
export class AccountManagementController {
  constructor(private readonly accountManagementService: AccountManagementService) {}

  // *** USERS ***
  @Get('users')
  @RequireRight(USER_RIGHTS.MANAGE_USERS)
  async getUsers() {
    return this.accountManagementService.getUsers();
  }

  @Put('users/:id')
  @RequireRight(USER_RIGHTS.MANAGE_USERS)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto) {
    return this.accountManagementService.updateUser(id, userDto);
  }

  @Put('users/:id/active')
  @RequireRight(USER_RIGHTS.MANAGE_USERS)
  async updateUserActive(@Param('id', ParseIntPipe) id: number, @Body() body: { active: boolean }) {
    return this.accountManagementService.updateUserActive(id, body.active);
  }

  // *** ROLES ***
  @Get('roles')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  async getRoles() {
    return this.accountManagementService.getRoles();
  }

  @Post('roles')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  async addRoles(@Body() roleDto: RoleDto) {
    return this.accountManagementService.addRole(roleDto);
  }

  @Put('roles/:id')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  async updateRoles(@Param('id', ParseIntPipe) id: number, @Body() roleDto: RoleDto) {
    return this.accountManagementService.updateRole(id, roleDto);
  }

  @Delete('roles/:id')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  async deleteRoles(@Param('id', ParseIntPipe) id: number) {
    return this.accountManagementService.deleteRole(id);
  }

  // *** RIGHTS ***
  @Get('rights')
  @RequireRight(USER_RIGHTS.MANAGE_ROLES)
  async getRights() {
    return this.accountManagementService.getRights();
  }
}
