import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { RfidCardsService } from './rfid_cards.service';
import { CreateRfidCardDto } from './dto/create-rfid_card.dto';
import { AssignCardToUserDto, ScanRfidDto } from './dto/update-rfid_card.dto';
import { RfidCardEntity } from './entities/rfid_card.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('rfid-cards')
export class RfidCardsController {
  constructor(private readonly rfidCardsService: RfidCardsService) {}

  @Post('create')
  async create(@Body() createRfidCardDto: CreateRfidCardDto) {
    return new RfidCardEntity(await this.rfidCardsService.create(createRfidCardDto))
  }

  @UseGuards(JwtAuthGuard)
  @Patch('assign')
  async assign(@Body() assignCardToUserDto: AssignCardToUserDto, @Request() req: any) {
    return new RfidCardEntity(await this.rfidCardsService.assign(assignCardToUserDto, req.user.userId));
  }

  @Patch('block/:id')
  async blockCard(@Param('id') id: string){
    return new RfidCardEntity(await this.rfidCardsService.blockCard(id))
  }

  @Post('scan')
  scan(@Body() scanRfidDto: ScanRfidDto) {
    return this.rfidCardsService.scan(scanRfidDto);
  }







// //   @UseGuards(JwtAuthGuard)
//   @Get()
//   findAll() {
//     return this.rfidCardsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.rfidCardsService.findOne(+id);
//   }

  @UseGuards(JwtAuthGuard)
  @Get('myCard')
  findMine(@Request() req: any) {
    const user_id = req.user.userId;
    return this.rfidCardsService.findOne(user_id);
  }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateRfidCardDto: UpdateRfidCardDto) {
//     return this.rfidCardsService.update(+id, updateRfidCardDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.rfidCardsService.remove(+id);
//   }
}
