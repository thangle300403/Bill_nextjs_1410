export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  login_by: "form" | "google" | string;
  is_active: number;
  province_id: string;
  ward_id: string;
  ward?: {
    id: string;
    name: string;
    province?: {
      id: string;
      name: string;
    };
  };
  housenumber_street: string;
  shipping_name: string;
  shipping_mobile: string;
}

export interface UserServer {
  id: number;
  name: string;
  mobile: string;
  email: string;
  login_by: string;
  ward_id: string;
  shipping_name?: string;
  shipping_mobile?: string;
  housenumber_street?: string;
  ward?: {
    id: string;
    name: string;
    province?: {
      id: string;
      name: string;
    };
  };
}

export interface AuthPayload {
  isLogin: boolean;
  loggedUser: User;
}
