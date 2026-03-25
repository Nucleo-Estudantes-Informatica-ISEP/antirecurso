import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Account creation moved to the ZITADEL hosted login flow. Use /register to continue.'
    },
    { status: 410 }
  );
}
