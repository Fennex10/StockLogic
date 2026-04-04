import { stockLogicApi } from "@/api/stockLogicApi";
import type { CreateSale } from "@/interface/sales/create-sale";
import type { Sale } from "@/interface/sales/sale.interface";
import { sleep } from "@/lib/sleep";

export const createSalesAction = async (
  providerLike: Partial<CreateSale> 
): Promise<Sale> => {

  await sleep(1500);

  const { id, ...rest } = providerLike;
  const isCreating = !id || id === "new";

  const formData = new FormData();

    if (!isCreating && id) {
    formData.append("id", id);
  }
  
  formData.append('productId', rest.productId ?? '');
  formData.append('clientName', rest.clientName ?? '');
  formData.append('quantity', String(rest.quantity ?? 0));
  formData.append('paymentMethod', rest.paymentMethod ?? '');
  formData.append('registerDate', String(rest.registerDate ?? ''));
  
  const { data } = await stockLogicApi<Sale>({
    url: "/sales", 
    method: "POST",
    data: formData,
  });

  return data;
};

