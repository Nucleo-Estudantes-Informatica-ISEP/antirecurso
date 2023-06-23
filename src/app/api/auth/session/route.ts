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

  const { token: newToken } = await res.json();
  if (res.status === 401) {
    const response = NextResponse.json({ data: res }, { status: 200 });

    response.cookies.set({
      name: config.cookies.token,
      value: newToken,
      maxAge: 60 * 60 * 24,
      httpOnly: true
    });

    return response;
  }
  if (token) return NextResponse.json({ data: token }, { status: 200 });
  return new Response(null, { status: 401 });
}
