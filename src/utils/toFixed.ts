export default function toFixed(n: number, digits: number) {
  return Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits);
}
