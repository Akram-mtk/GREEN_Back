import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService){}


  async create(createUserDto: CreateUserDto){
    return this.prisma.users.create({
        data: createUserDto
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto){
    return this.prisma.users.update({
        where: { id },
        data: updateUserDto
    })
  }

    


}


