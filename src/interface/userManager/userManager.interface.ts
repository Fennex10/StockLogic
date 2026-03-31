import type { Role } from "./userManagerRole";

export interface UserManager {
    id:                      string;
    name:                    string;
    email:                   string;
    password:                string;
    activateToken:           string;
    activateTokenExpiration: Date;
    resetToken:              null;
    resetTokenExpiration:    null;
    isActive:                boolean;
    companyId:               string;
    roleId:                  string;
    createdAt:               Date;
    updatedAt:               Date;
    Role:                    Role;
}