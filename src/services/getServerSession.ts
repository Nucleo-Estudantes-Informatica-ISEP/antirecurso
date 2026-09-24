import { CLIENT_SESSION_TOKEN, getApiAccessToken, getAppAuthSession } from '@/lib/server-auth';
import { Session } from '@/types/Session';
import User from '@/types/User';
import Score from '@/types/Score';
import PendingExam from '@/types/PendingExam';
import { apiRequest } from './apiClient';

async function requestAuthenticated<T>(path: string): Promise<T | null> {
  const accessToken = await getApiAccessToken();
  if (!accessToken) return null;

  try {
    return await apiRequest<T>(path, {
      authenticated: true,
      accessToken,
      cache: 'no-store'
    });
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<Session | null> {
  const session = await getAppAuthSession();
  if (!session?.user) return null;

  const user = await requestAuthenticated<User>('user');
  return user ? { token: CLIENT_SESSION_TOKEN, user } : null;
}

export async function getUserScores() {
  return requestAuthenticated<Score[]>('user/scores');
}

export async function getPendingExams() {
  return requestAuthenticated<{ data: PendingExam[] }>('exams/pending');
}
