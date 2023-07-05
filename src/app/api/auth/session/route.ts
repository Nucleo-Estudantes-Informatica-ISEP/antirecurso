import { NextRequest, NextResponse } from 'next/server';
import config from 'src/config';
import { BASE_URL } from 'src/services/api';
import swal from 'sweetalert';

export async function GET(request: NextRequest) {
  const t = request.cookies.get(config.cookies.token) as { value: string } | undefined;
  const token = t?.value;

  const res = await fetch(`${BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (res.status === 404) {
    const response = NextResponse.json({ data: res }, { status: 200 });

    swal('Sessão expirada', 'A tua sessão expirou, faz login novamente', 'warning');

    response.cookies.delete(config.cookies.token);
    return response;
  }

  if (token) return NextResponse.json({ data: token }, { status: 200 });
  return new Response(null, { status: 401 });
}
