import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AccountManagementService } from './account-management.service';
import { RightDto } from './dto/right.dto';
import { RoleDto } from './dto/role.dto';
import { UserDto } from './dto/user.dto';

@Controller('account-management')
export class AccountManagementController {
  constructor(private readonly accountManagementService: AccountManagementService) {}

  // *** USERS ***
  @Get('users')
  async getUsers() {
    return this.accountManagementService.getUsers();
  }

  @Post('users')
  async addUser(@Body() userDto: UserDto) {
    return this.accountManagementService.addUser(userDto);
  }

  @Put('users/:id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto) {
    return this.accountManagementService.updateUser(id, userDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.accountManagementService.deleteUser(id);
  }

  @Put('users/:id/active')
  async updateUserActive(@Param('id', ParseIntPipe) id: number, @Body() body: { active: boolean }) {
    console.log(id, body.active);
    return this.accountManagementService.updateUserActive(id, body.active);
  }

  // *** ROLES ***
  @Get('roles')
  async getRoles() {
    return this.accountManagementService.getRoles();
  }

  @Post('roles')
  async addRoles(@Body() roleDto: RoleDto) {
    return this.accountManagementService.addRole(roleDto);
  }

  @Put('roles/:id')
  async updateRoles(@Param('id', ParseIntPipe) id: number, @Body() roleDto: RoleDto) {
    return this.accountManagementService.updateRole(id, roleDto);
  }

  @Delete('roles/:id')
  async deleteRoles(@Param('id', ParseIntPipe) id: number) {
    return this.accountManagementService.deleteRole(id);
  }

  // *** RIGHTS ***
  @Get('rights')
  async getRights() {
    return this.accountManagementService.getRights();
  }

  @Post('rights')
  async addRight(@Body() rightDto: RightDto) {
    return this.accountManagementService.addRight(rightDto);
  }

  @Put('rights/:id')
  async updateRight(@Param('id', ParseIntPipe) id: number, @Body() rightDto: RightDto) {
    return this.accountManagementService.updateRight(id, rightDto);
  }

  @Delete('rights/:id')
  async deleteRight(@Param('id', ParseIntPipe) id: number) {
    return this.accountManagementService.deleteRight(id);
  }
}
