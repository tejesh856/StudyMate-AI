import { proxyRequest } from '@/lib/proxyRequest';

export async function GET(_, { params }) {
  const { id } = params;
  return proxyRequest(_, {
    backendPath: `/api/learn/course/${id}`,
    method: 'GET',
  });
}

export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();
  return proxyRequest(req, {
    backendPath: `/api/learn/course/${id}`,
    method: 'PATCH',
    body,
  });
}
