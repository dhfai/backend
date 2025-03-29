import { Controller, Get, Param, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApproveUserDto } from '../auth/dtos/approve-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Role } from '../common/decorators/role.decorator';
import { UserRole } from '../entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.OWNER)
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post('approve/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.OWNER)
  approveUser(@Param('id') id: string) {
    return this.usersService.approveUser(id);
  }

  @Post('reject/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.OWNER)
  rejectUser(@Param('id') id: string) {
    return this.usersService.rejectUser(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(UserRole.OWNER)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
