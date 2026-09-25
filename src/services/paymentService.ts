import { apiFetch } from './api';

export interface PaymentOrder {
  id: string;
  order_id: string;
  booking_ref?: string | null;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  created_at: string;
  updated_at?: string | null;
}

export async function createOrder(bookingRef: string, amount: number) {
  return apiFetch<{ orderId: string; amount: number; status: string }>('/api/payments/create-order', { method: 'POST', body: JSON.stringify({ bookingRef, amount }) });
}
export async function verifyPayment(orderId: string) {
  return apiFetch<{ status: string; orderId: string }>('/api/payments/verify', { method: 'POST', body: JSON.stringify({ orderId }) });
}
export async function getOrderStatus(orderId: string): Promise<PaymentOrder> {
  return apiFetch<PaymentOrder>(`/api/payments/${orderId}`);
}
