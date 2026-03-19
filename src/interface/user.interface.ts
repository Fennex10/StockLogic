import type { RoleCode } from "@/auth/type/roleCode";

export interface User {
    id:        number;
    email:     string;
    userName:  string;
    companyId: string;
    roleCode:  RoleCode;
}
