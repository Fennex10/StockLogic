import type { UserManager } from "./userManager.interface";

export interface UserManagersResponse {
    message: string;
    data: UserManager[];
}