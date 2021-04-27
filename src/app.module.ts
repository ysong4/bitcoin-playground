import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { BitcoinAddressModule } from './bitcoin-address/bitcoin-address.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    BitcoinAddressModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
