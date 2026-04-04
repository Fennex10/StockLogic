export interface CreateSale {
    id: string;
    productId: string;
    clientName: string; 
    quantity: number; 
    paymentMethod: string; 
    registerDate: Date;
}
