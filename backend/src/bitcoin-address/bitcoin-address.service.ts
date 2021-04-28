import { Injectable } from '@nestjs/common';
import { GenerateHDSegWitAddressDto } from './dto/generate-hd-segwit-address.dto';
import { GenerateMultiSigP2SHAddressDto } from './dto/generate-multi-sig-p2sh-address.dto';
import HDKey from 'hdkey';
import crypto from 'crypto';
// import bs58check from 'bs58check';
import { bech32 } from 'bech32';
import * as bitcoin from 'bitcoinjs-lib';

@Injectable()
export class BitcoinAddressService {
  async generateHDSegWitAddress(
    dto: GenerateHDSegWitAddressDto,
  ): Promise<string> {
    const hdKey = HDKey.fromMasterSeed(Buffer.from(dto.seed, 'hex'));
    const childKey = hdKey.derive(dto.path);

    // hash160
    const sha = crypto.createHash('sha256').update(childKey.publicKey).digest();
    const publicKeyHash = crypto.createHash('ripemd160').update(sha).digest();

    // // P2PKH address, start with '1'
    // const addressP2PKH = bs58check.encode(
    //   Buffer.concat([Buffer.alloc(1, 0), publicKeyHash]),
    // );
    // console.log(addressP2PKH);

    // // P2SH address, start with '3'
    // const { address } = bitcoin.payments.p2sh({
    //   redeem: bitcoin.payments.p2wpkh({ pubkey: childKey.publicKey }),
    // });
    // console.log(address);

    // Native SegWit address, bec32 format, start with 'bc1'
    const words = bech32.toWords(publicKeyHash);
    words.unshift(0);
    const addressBec32 = bech32.encode('bc', words);

    // Another way to generate native segwit address
    // const { address } = bitcoin.payments.p2wpkh({ pubkey: childKey.publicKey });

    return addressBec32;
  }

  async generateMultiSigP2SHAddress(
    dto: GenerateMultiSigP2SHAddressDto,
  ): Promise<string> {
    const pubKeys = dto.publicKeys.map((hex: string) =>
      Buffer.from(hex, 'hex'),
    );
    const { address } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2ms({ m: dto.m, pubkeys: pubKeys }),
    });

    return address;
  }
}
