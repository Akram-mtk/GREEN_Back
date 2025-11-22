import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

//   @Post('register')
//   async register(@Body() createUserDto: CreateUserDto) {
//     const user = await this.usersService.create(createUserDto);
//     // optional: auto-login after register
//     const { password_hash, ...result } = user;
//     return result;
//   }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto)
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password
    );
    if (!user) {
      // you can throw UnauthorizedException here instead
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  // Example of a route just to test token:
  @UseGuards(JwtAuthGuard)
  @Post('me')
  getProfile(@Request() req) {
    return req.user; // { userId, email }
  }
  
}
