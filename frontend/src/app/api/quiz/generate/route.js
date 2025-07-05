import { proxyRequest } from '@/lib/proxyRequest';

export async function POST(req) {
  const body = await req.json();
  return proxyRequest(req, {
    backendPath: '/api/quiz/generate',
    method: 'POST',
    body,
  });
}
