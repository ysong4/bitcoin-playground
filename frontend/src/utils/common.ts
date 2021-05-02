import base58 from 'bs58';
import crypto from 'crypto';

export function isHex(str: string) {
  return /^[A-F0-9]+$/i.test(str);
}

export function hash160(data: Buffer): Buffer {
  const sha = crypto.createHash('sha256').update(data).digest();
  return crypto.createHash('ripemd160').update(sha).digest();
}

export function base58checkEncode(data: Buffer): string {
  // Do double sha256 to calculate checksum
  const sha = crypto.createHash('sha256').update(data).digest();
  const doubleSha = crypto.createHash('sha256').update(sha).digest();
  
  const checksum = doubleSha.slice(0, 4);

  return base58.encode(Buffer.concat([data, checksum]));
}
