import { Body, Controller, Post, Patch, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('users')
export class UsersController {
  
  constructor(private readonly userService: UsersService){}

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any
  ) {
    return new UserEntity(await this.userService.update(req.user.userId, updateUserDto));
  }



}
