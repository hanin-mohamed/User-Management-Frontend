export interface UserCreateRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  salary?: number | null;
}
