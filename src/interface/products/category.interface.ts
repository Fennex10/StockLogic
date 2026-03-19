import type { User } from "../user.interface";

export interface Category {
    id:          string;
    name:        string;
    description: string;
    companyId:   User;
    createdAt:   Date;
    updatedAt:   Date;
}
