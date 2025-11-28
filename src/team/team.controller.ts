import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { File as MulterFile } from 'multer';



@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage()
    }),
  )
  create(
    @Body() createTeamDto: CreateTeamDto,
    @UploadedFile() file: MulterFile) {
    return this.teamService.create(createTeamDto, file);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
  //   return this.teamService.update(+id, updateTeamDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.teamService.remove(+id);
  // }
}
