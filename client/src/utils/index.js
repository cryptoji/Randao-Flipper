export function getShortAddress(address, number = 8) {
  if (!address) return;
  const length = address.length;
  return `${address.substring(0, number)}...${address.substring(length-number, length)}`
}