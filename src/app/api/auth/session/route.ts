import { NextRequest, NextResponse } from 'next/server';
import config from 'src/config';
import { BASE_URL } from 'src/services/api';

export async function GET(request: NextRequest) {
  const t = request.cookies.get(config.cookies.token) as { value: string } | undefined;
  const token = t?.value;

  if (!token) return new NextResponse(null, { status: 401 });

  const res = await fetch(`${BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (res.status === 404) {
    const response = new NextResponse(null, { status: 401 });
    response.cookies.delete(config.cookies.token);
    return response;
  }

  return NextResponse.json({ token, user: await res.json() }, { status: 200 });
}
