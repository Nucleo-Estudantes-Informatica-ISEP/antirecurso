import { NextRequest, NextResponse } from 'next/server';
import config from 'src/config';
import { BASE_URL } from 'src/services/api';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password)
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

  const res = await fetch(BASE_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    cache: 'no-store',
    body: JSON.stringify({
      email,
      password
    })
  });

  if (res.status === 200) {
    const { token } = await res.json();
    const response = NextResponse.json({ data: res }, { status: 200 });

    response.cookies.set({
      name: config.cookies.token,
      value: token,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true
    });
    return response;
  }

  const { message } = await res.json();
  return NextResponse.json({ error: message }, { status: res.status });
}
