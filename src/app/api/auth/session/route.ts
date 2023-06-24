import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import config from 'src/config';
import { BASE_URL } from 'src/services/api';

export async function GET() {
  const cookieStore = cookies();
  const t = cookieStore.get(config.cookies.token) as { value: string } | undefined;
  const token = t?.value;

  const res = await fetch(`${BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 404) {
    const response = NextResponse.json({ data: res }, { status: 200 });

    response.cookies.delete(config.cookies.token);
    return response;
  }

  if (token) return NextResponse.json({ data: token }, { status: 200 });
  return new Response(null, { status: 401 });
}
