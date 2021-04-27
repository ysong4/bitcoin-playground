import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { BitcoinAddressService } from './bitcoin-address.service';
import { GenerateHDSegWitAddressDto } from './dto/generate-hd-segwit-address.dto';
import { GenerateMultiSigP2SHAddressDto } from './dto/generate-multi-sig-p2sh-address.dto';

@ApiTags('bitcoin-address')
@Controller('bitcoin-address')
export class BitcoinAddressController {
  constructor(private readonly service: BitcoinAddressService) {}

  @Post('hd-segwit')
  @ApiCreatedResponse({
    description: 'Successfully generated an HD SegWit bitcoin address',
    type: String,
  })
  async generateHDSegWitAddress(
    @Body() dto: GenerateHDSegWitAddressDto,
  ): Promise<string> {
    try {
      return await this.service.generateHDSegWitAddress(dto);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('multi-sig-p2sh')
  @ApiCreatedResponse({
    description:
      'Successfully generated an n-out-of-m Multisignature P2SH bitcoin address',
    type: String,
  })
  async generateMultiSigP2SHAddress(
    @Body() dto: GenerateMultiSigP2SHAddressDto,
  ): Promise<string> {
    try {
      return await this.service.generateMultiSigP2SHAddress(dto);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
