export type Province = { id: number; name: string };
export type Ward = { id: number; name: string; province_id: number };
export interface DeliveryFormValues {
  fullname: string;
  mobile: string;
  province: string;
  ward: string;
  address: string;
  payment_method: string;
}
