import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService){}


  async create(createUserDto: CreateUserDto){

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    if (!saltRounds || isNaN(saltRounds)) {
      throw new Error("BCRYPT_SALT_ROUNDS must be set and numeric");
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, saltRounds);
    try{
      return await this.prisma.users.create({
        data: createUserDto
      })
    }catch (err){
      if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
        throw new ConflictException('Email already used');
      }
      throw err;
    }

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


