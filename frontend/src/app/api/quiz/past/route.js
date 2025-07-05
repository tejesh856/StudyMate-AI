import { proxyRequest } from '@/lib/proxyRequest';

export async function GET(req) {
  return proxyRequest(req, {
    backendPath: '/api/quiz/past',
    method: 'GET',
  });
}
