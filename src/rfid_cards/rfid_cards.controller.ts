import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RfidCardsService } from './rfid_cards.service';
import { CreateRfidCardDto } from './dto/create-rfid_card.dto';
import { UpdateRfidCardDto, AssignCardToUserDto } from './dto/update-rfid_card.dto';
import { RfidCardEntity } from './entities/rfid_card.entity';

@Controller('rfid-cards')
export class RfidCardsController {
  constructor(private readonly rfidCardsService: RfidCardsService) {}

  @Post('create')
  async create(@Body() createRfidCardDto: CreateRfidCardDto) {
    return new RfidCardEntity(await this.rfidCardsService.create(createRfidCardDto))
  }

  @Patch('assign')
  async assign(@Body() assignCardToUserDto: AssignCardToUserDto){
    return new RfidCardEntity(await this.rfidCardsService.assign(assignCardToUserDto))
  }








  @Get()
  findAll() {
    return this.rfidCardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rfidCardsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRfidCardDto: UpdateRfidCardDto) {
    return this.rfidCardsService.update(+id, updateRfidCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rfidCardsService.remove(+id);
  }
}
