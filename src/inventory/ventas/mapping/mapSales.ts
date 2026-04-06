import type { Sale } from "@/interface/sales/sale.interface";
import type { CreateSale } from "@/interface/sales/create-sale";

export const mapToCreateSale = (s: Sale): CreateSale => ({
  id: s.id || '',
  productId: s.productId || '',
  clientName: s.clientName || '',
  quantity: s.quantity || 0,
  paymentMethod: s.paymentMethod || '',
  registerDate: s.registerDate || '',
});
