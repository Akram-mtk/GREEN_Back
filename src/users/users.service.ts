import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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
    }catch (err: any){
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

  async changePassword(id: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
    if (!saltRounds || isNaN(saltRounds)) {
      throw new Error('BCRYPT_SALT_ROUNDS must be set and numeric');
    }

    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect current password');

    const hashedNew = await bcrypt.hash(dto.newPassword, saltRounds);
    await this.prisma.users.update({
      where: { id },
      data: { password: hashedNew },
    });
    return { message: 'Password changed successfully' };
  }

  async findByEmail(email: string) {
    return this.prisma.users.findUnique({ where: { email } });
  }




}


