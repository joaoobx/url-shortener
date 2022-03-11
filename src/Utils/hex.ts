export function convertFromHex(input: string) {
  const hex = input.toString();
  let str = '';
  for (let i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export function convertToHex(input: string) {
  let hex = '';
  for (let i = 0; i < input.length; i += 1) {
    hex += input.charCodeAt(i).toString(16);
  }
  return hex;
}
