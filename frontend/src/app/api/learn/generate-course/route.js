import { proxyRequest } from '@/lib/proxyRequest';

export async function POST(req) {
  const body = await req.json();
  return proxyRequest(req, {
    backendPath: '/api/learn/generate-course',
    method: 'POST',
    body,
  });
}
