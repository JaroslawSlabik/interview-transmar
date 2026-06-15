export interface AssemblyLine {
  id: bigint;
  product_id: bigint;
  name: string;
  is_active: boolean;
  created_at: Date;
}
