import { IsHexadecimal, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsValidPath } from '../validators/is-valid-path.validator';

export class GenerateHDSegWitAddressDto {
  /**
   * Seed
   * @example '67f93560761e20617de26e0cb84f7234aaf373ed2e66295c3d7397e6d7ebe882ea396d5d293808b0defd7edd2babd4c091ad942e6a9351e6d075a29d4df872af'
   */
  @IsNotEmpty()
  @IsHexadecimal()
  @Length(128, 128) // 128 characters hex string, is a 64 byte array
  seed: string;

  /**
   * Path
   * @example "m/44'/0'/0'/0/0"
   */
  @IsValidPath({ message: 'Path is not valid' })
  @IsNotEmpty()
  @IsString()
  path: string;
}
