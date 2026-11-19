import { NextRequest, NextResponse } from 'next/server';
import { SERVER_API_BASE_URL } from '@/services/api';
import { getApiAccessToken } from '@/lib/server-auth';
import { isSameOriginRequest } from '@/lib/request-origin';
import { forwardBackendRequest } from '@/lib/backend-proxy';

export const dynamic = 'force-dynamic';

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (['GET', 'HEAD'].includes(request.method)) {
    if (path[0] === 'exams' && path[1] === 'generate') {
      return NextResponse.json(
        { message: 'Exam generation requires POST' },
        {
          status: 405,
          headers: { allow: 'POST' }
        }
      );
    }
  } else if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: 'Request origin is not allowed' }, { status: 403 });
  }
  const accessToken = await getApiAccessToken();

  if (!accessToken) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  return forwardBackendRequest({
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
