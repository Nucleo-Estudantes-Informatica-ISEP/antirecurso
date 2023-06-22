export default function sanitizeOption(text: string) {
  if (text === text.toUpperCase()) return text.charAt(0) + text.slice(1).toLowerCase();

  return text;
}
