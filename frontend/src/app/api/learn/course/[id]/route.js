import { proxyRequest } from '@/lib/proxyRequest';

export async function GET(req,context) {
  const { id } = await context.params;
  return proxyRequest(req, {
    backendPath: `/api/learn/course/${id}`,
    method: 'GET',
  });
}

export async function PATCH(req, context) {
  const { id } = await context.params;
  const body = await req.json();
  return proxyRequest(req, {
    backendPath: `/api/learn/course/${id}`,
    method: 'PATCH',
    body,
  });
}
