export function chunkArray(array: string[], chunkSize: number): string[][] {
  return Array(Math.ceil(array.length / chunkSize))
    .fill("")
    .map((_, index) => index * chunkSize)
    .map((begin) => array.slice(begin, begin + chunkSize));
}
