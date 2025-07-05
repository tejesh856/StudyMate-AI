import { proxyRequest } from '@/lib/proxyRequest';

export async function GET(req, { params }) {
  const { id } = params;
  return proxyRequest(req, {
    backendPath: `/api/quiz/review/${id}`,
    method: 'GET',
  });
}
