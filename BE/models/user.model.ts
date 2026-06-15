export interface User {
  id: bigint;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  last_login_at: Date | null;
}
