
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
    companyId:    string;
    createdAt:    Date;
    updatedAt:    Date;
    productCount: number;
}
