import type { User } from "../user.interface";

export interface Category {
    id:          string;
    name:        string;
    description: string;
    isActive:    boolean;
    companyId:   User;
    createdAt:   Date;
    updatedAt:   Date;
}
