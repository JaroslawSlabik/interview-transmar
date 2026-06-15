export interface LoginResponse {
  token: string;
  message: string;
  expires_in: string;
}

export interface Product {
  id: number;
  name: string;
  created_at: string;
}

export interface AssemblyLine {
  id: number;
  product_id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface Workstation {
  id: number;
  short_name: string;
  name: string;
  pc_name: string;
  created_at: string;
}

export interface WorkstationWithOrder extends Workstation {
  display_order: number;
}
