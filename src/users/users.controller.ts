import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Post('create')
    async create(@Body() createUserDto: CreateUserDto){
        return new UserEntity(await this.userService.create(createUserDto))
    }

    @Patch(":id")
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return new UserEntity(await this.userService.update(id, updateUserDto));
    }



}
