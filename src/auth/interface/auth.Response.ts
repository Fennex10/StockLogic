import type { User } from "@/interface/user.interface";

export interface AuthResponse {
    user:  User;
    token: string;
}

