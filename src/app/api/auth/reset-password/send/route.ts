import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Password recovery is handled by the ZITADEL hosted login page. Open /reset-password to continue.'
    },
    { status: 410 }
  );
}
