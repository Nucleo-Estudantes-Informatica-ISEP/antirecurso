import { NextRequest, NextResponse } from 'next/server';
import config from 'src/config';
import { BASE_URL } from 'src/services/api';

export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: 'Name, Email and password are required' }, { status: 400 });

  const res = await fetch(BASE_URL + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    cache: 'no-store',
    body: JSON.stringify({
      name,
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
      maxAge: 60 * 60 * 24,
      httpOnly: true
    });
    return response;
  } else if (res.status === 500) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  const { message } = await res.json();
  return NextResponse.json({ error: message }, { status: res.status });
}
