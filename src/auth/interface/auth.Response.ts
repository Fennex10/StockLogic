import type { User } from "@/interface/user/user.interface";

export interface AuthResponse {
    user:  User;
    token: string;
}
