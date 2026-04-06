import type { UserManager } from "./userManager.interface";

export interface UserManagerResponse {
    message: string;
    data: UserManager;
}