import { proxyRequest } from '@/lib/proxyRequest';

export async function POST(req) {
  return proxyRequest(req, {
    backendPath: '/api/auth/logout',
    method: 'POST',
  });
}
