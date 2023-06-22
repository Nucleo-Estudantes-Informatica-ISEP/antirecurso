import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import config from 'src/config';

export async function GET() {
  const cookieStore = cookies();
  const t = cookieStore.get(config.cookies.token) as { value: string } | undefined;
  const token = t?.value;

  if (token) return NextResponse.json({ data: token }, { status: 200 });
  return new Response(null, { status: 401 });
}
