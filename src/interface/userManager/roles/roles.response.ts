import type { Roles } from "./roles.interfaces";

export interface UserRolesResponse {
    message: string;
    data:    Roles[];
}
