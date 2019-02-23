export function getShortAddress(address) {
  if (!address) return;
  const length = address.length;
  return `${address.substring(0, 8)}...${address.substring(length-8, length)}`
}