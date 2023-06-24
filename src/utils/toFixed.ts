export default function toFixed(n: number, digits: number) {
  return Math.trunc(n * Math.pow(10, digits)) / Math.pow(10, digits);
}
