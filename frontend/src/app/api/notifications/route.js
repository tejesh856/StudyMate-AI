import { proxyRequest } from '@/lib/proxyRequest';

export async function PATCH(req, { params }) {
  const { id } = params;
  return proxyRequest(req, {
    backendPath: `/api/notifications/${id}/read`,
    method: 'PATCH',
  });
}
