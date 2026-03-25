import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Password reset is handled by the AuthNEI hosted login page. Open /reset-password to continue.'
    },
    { status: 410 }
  );
}
