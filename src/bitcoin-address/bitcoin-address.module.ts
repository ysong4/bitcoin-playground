import { Module } from '@nestjs/common';
import { BitcoinAddressController } from './bitcoin-address.controller';
import { BitcoinAddressService } from './bitcoin-address.service';

@Module({
  controllers: [BitcoinAddressController],
  providers: [BitcoinAddressService]
})
export class BitcoinAddressModule {}
