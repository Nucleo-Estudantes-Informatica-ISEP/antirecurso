import { NextResponse } from 'next/server';
import config from 'src/config';

export async function PATCH() {
  const response = new NextResponse();
  response.cookies.delete(config.cookies.token);
  return response;
}
