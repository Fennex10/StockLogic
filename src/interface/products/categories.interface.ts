import type { User } from "../user.interface";

export interface Categories {
    id:          string;
    name:        string;
    description: string;
    companyId:   User;
    createdAt:   Date;
    updatedAt:   Date;
}
