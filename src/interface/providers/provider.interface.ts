import type { User } from "../user/user.interface";

export interface Provider {
    id:           string;
    name:         string;
    taxId:        string;
    contactName:  string;
    email:        string;
    phone:        string;
    address:      string;
    website:      string;
    isActive:     boolean;
    companyId:    User;
    createdAt:    Date;
    updatedAt:    Date;
    productCount: number;
}
