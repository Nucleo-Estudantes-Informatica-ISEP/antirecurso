import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Password login was replaced by the AuthNEI hosted login flow. Use /login to continue.'
    },
    { status: 410 }
  );
}
