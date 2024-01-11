import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from 'src/services/api';

export async function POST(request: NextRequest) {
  const { email, code, password } = await request.json();

  if (!email || !password || !code)
    return NextResponse.json({ error: 'Email, password and code are required' }, { status: 400 });

  const res = await fetch(BASE_URL + '/auth/reset-password/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    cache: 'no-store',
    body: JSON.stringify({
      email,
      code,
      password
    })
  });

  if (res.status === 200) {
    const response = NextResponse.json({ data: res }, { status: 200 });
    return response;
  }

  const { message } = await res.json();
  return NextResponse.json({ error: message }, { status: res.status });
}
