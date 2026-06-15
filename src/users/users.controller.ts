import { Body, Controller, Post, Patch, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('users')
export class UsersController {
  
  constructor(private readonly userService: UsersService){}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any
  ) {
    return this.userService.update(req.user.userId, updateUserDto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: any
  ) {
    return this.userService.changePassword(req.user.userId, changePasswordDto);
  }



}
