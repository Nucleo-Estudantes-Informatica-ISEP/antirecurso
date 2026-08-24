import { NextRequest, NextResponse } from 'next/server';
import { SERVER_API_BASE_URL } from '@/services/api';
import { getApiAccessToken } from '@/lib/server-auth';
import { forwardAuthenticatedBackendRequest } from '@/lib/backend-proxy';

export const dynamic = 'force-dynamic';

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const accessToken = await getApiAccessToken();

  if (!accessToken) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  return forwardAuthenticatedBackendRequest({
    request,
    path,
    accessToken,
    backendBaseUrl: SERVER_API_BASE_URL
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
