import { NextRequest } from 'next/server';
import { SERVER_API_BASE_URL } from '@/services/api';
import { forwardBackendRequest } from '@/lib/backend-proxy';

export const dynamic = 'force-dynamic';

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  return forwardBackendRequest({ request, path, backendBaseUrl: SERVER_API_BASE_URL });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
