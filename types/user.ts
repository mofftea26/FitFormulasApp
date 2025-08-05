export interface UserProfile {
  id: string;
  createdAt: string;
  username: string;
  gender?: string;
  dateOfBirth?: string;
  heightCm: number;
  weightKg: number;
  emailVerified: boolean;
}
