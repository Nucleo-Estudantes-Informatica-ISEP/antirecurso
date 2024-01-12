import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL } from 'src/services/api';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const res = await fetch(BASE_URL + '/auth/reset-password/send-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    cache: 'no-store',
    body: JSON.stringify({
      email
    })
  });

  if (res.status === 200) {
    const response = NextResponse.json({ data: res }, { status: 200 });
    return response;
  }

  const { message } = await res.json();
  return NextResponse.json({ error: message }, { status: res.status });
}
