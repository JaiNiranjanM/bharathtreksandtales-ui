import { apiFetch } from './api';

export async function getWishlist(token: string): Promise<string[]> {
  return apiFetch<string[]>('/api/wishlist', { headers: { Authorization: `Bearer ${token}` } });
}
export async function addToWishlist(token: string, packageId: string) {
  return apiFetch('/api/wishlist', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ packageId }) });
}
export async function removeFromWishlist(token: string, packageId: string) {
  return apiFetch(`/api/wishlist/${packageId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
}
