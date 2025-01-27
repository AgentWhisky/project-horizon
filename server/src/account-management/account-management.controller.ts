import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AccountManagementService } from './account-management.service';
import { UserData } from './account-management.type';
import { RightDto } from './dto/right.dto';

@Controller('account-management')
export class AccountManagementController {
  constructor(private readonly accountManagementService: AccountManagementService) {}

  @Get('users')
  async getUsers() {
    return this.accountManagementService.getUsers();
  }

  @Post('users')
  async addUser(@Body() user: UserData) {
    return this.accountManagementService.addUser(user);
  }

  @Put('users/:id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UserData) {
    return this.accountManagementService.updateUser(id, user);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.accountManagementService.deleteUser(id);
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
