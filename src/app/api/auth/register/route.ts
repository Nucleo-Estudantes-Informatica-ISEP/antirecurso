import { NextRequest, NextResponse } from 'next/server';
import config from 'src/config';
import { BASE_URL } from 'src/services/api';

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password)
    return new Response('Name, Email and password are required', { status: 400 });

  const res = await fetch(BASE_URL + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      email,
      password
    })
  });

  const { token } = await res.json();
  if (res.status === 200) {
    const response = NextResponse.json({ data: res }, { status: 200 });

    response.cookies.set({
      name: config.cookies.token,
      value: token,
      maxAge: 60 * 60 * 24,
      httpOnly: true
    });
    return response;
  }

  return res;
}
