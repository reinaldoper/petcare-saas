export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  clinicId: number;
}
