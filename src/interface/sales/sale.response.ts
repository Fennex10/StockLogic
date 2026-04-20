import type { Purchase } from "./purchases.interface";
import type { Sale } from "./sale.interface";
import type { Stats } from "./stats.interface";

export interface SaleResponse {
    message: string;
    data:    Data;
}

export interface Data {
    sales: Sale;
    stats: Stats;
    purchases: Purchase;
}

