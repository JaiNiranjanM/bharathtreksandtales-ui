import { apiFetch } from './api';

export async function submitContact(data: { name: string; email: string; message: string }) {
  return apiFetch<{ id: string }>('/api/contact', { method: 'POST', body: JSON.stringify(data) });
}
