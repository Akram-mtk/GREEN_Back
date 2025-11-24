import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService){}


  async create(createUserDto: CreateUserDto){
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
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

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }

    


}


