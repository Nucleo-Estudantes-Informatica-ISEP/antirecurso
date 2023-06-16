// workaround to read cookies in client components
export default async function useToken(): Promise<string | null> {
  const res = await fetch('/api/session');
  if (res.status === 200) {
    const data = await res.json();
    return data.token;
  }
  return null;
}
