import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { IsNotLargerThan } from '../validators/is-not-larger-than.validator';
import { LengthEqualTo } from '../validators/length-equal-to.validator';

export class GenerateMultiSigP2SHAddressDto {
  /**
   * m
   * @description 'number of public keys when generate the address'
   * @example '3'
   */
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  m: number;

  /**
   * n
   * @description 'number of signatures when spend the bitcoin on the address'
   * @example '2'
   */
  @IsNotLargerThan('m', { message: 'n should be <= m' })
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  n: number;

  /**
   * Public keys
   * @example '["026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01", "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9", "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"]'
   */
  @LengthEqualTo('m', { message: 'number of public keys should be equal to m' })
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  publicKeys: string[];
}
