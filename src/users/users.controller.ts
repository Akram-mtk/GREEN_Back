import { Body, Controller, Post, Patch, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Patch(":id")
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req: any
    ) {
        if(id != req.user.userId){
            throw new ForbiddenException('You cannot update another user.');
        }
        return new UserEntity(await this.userService.update(id, updateUserDto));
    }



}
