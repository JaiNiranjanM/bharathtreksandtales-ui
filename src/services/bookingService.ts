import { apiFetch } from './api';

export interface BookingPayload {
  packageSlug: string;
  seats: number;
  date: string;
  pickupLocation: string;
  name: string;
  email: string;
  phone: string;
  phoneCode?: string;
  couponCode?: string;
  specialRequests?: string;
}
export interface BookingResponse {
  success: boolean;
  bookingRef: string;
  totalAmount: number;
  orderId: string;
  paymentStatus: string;
  packageTitle: string;
  message: string;
}
export interface BookingRow {
  booking_ref: string;
  created_at: string;
  status: string;
  payment_status?: string;
  payment_id?: string;
  order_id?: string;
  user_id?: string;
  package_slug: string;
  seats: number;
  date: string;
  pickup_location: string;
  name: string;
  email: string;
  phone: string;
  coupon_code?: string | null;
  special_requests?: string | null;
  total_amount: number;
}
export async function submitBooking(data: BookingPayload): Promise<BookingResponse> {
  return apiFetch<BookingResponse>('/api/bookings', { method: 'POST', body: JSON.stringify(data) });
}
export async function getBookingByRef(ref: string): Promise<BookingRow> {
  return apiFetch<BookingRow>(`/api/bookings/${ref}`);
}
export async function getMyBookings(token: string): Promise<BookingRow[]> {
  return apiFetch<BookingRow[]>('/api/bookings/my', { headers: { Authorization: `Bearer ${token}` } });
}
