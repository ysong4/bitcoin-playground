export default function isHex(str: string) {
  return /^[A-F0-9]+$/i.test(str);
}
