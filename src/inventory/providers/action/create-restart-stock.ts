import { stockLogicApi } from "@/api/stockLogicApi";
import type { CreateRestartStock } from "@/interface/providers/create-restart-stock";
import { sleep } from "@/lib/sleep";

export const createRestartStockAction = async (
  restartStockLike: Partial<CreateRestartStock> 
): Promise<CreateRestartStock> => {

  await sleep(1500);

  const { productId, ...rest } = restartStockLike;

  const isCreating = !productId|| productId === "new";

  const formData = new FormData();
  
  if (!isCreating && productId) {
    formData.append("id", productId);
   }

  formData.append("productRestockQuantity", String(rest.productRestockQuantity ?? 0));
  formData.append("reference",rest. reference ?? "");

  console.log("📦 Enviando:", {
    url: `/providers/${productId}`,
    productRestockQuantity: rest.productRestockQuantity,
    reference: rest.reference
  });

  const { data } = await stockLogicApi<CreateRestartStock>({
    url: `/providers/${productId}`, 
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
};

// import { stockLogicApi } from "@/api/stockLogicApi";
// import type { CreateRestartStock } from "@/interface/providers/create-restart-stock";
// // import type { Provider } from "@/interface/providers/provider.interface";
// import { sleep } from "@/lib/sleep";

// export const createRestartStockAction = async (
//   restartStockLike: Partial<CreateRestartStock> 
// ): Promise<CreateRestartStock> => {

//   await sleep(1500);

//   const { id, ...rest } = restartStockLike;
//   const isCreating = !id || id === "new";

//   const formData = new FormData();

//     if (!isCreating && id) {
//     formData.append("id", id);
//   }
  
//   formData.append('productId', rest.productId ?? '');
//   formData.append('productRestockQuantity', String(rest.productRestockQuantity ?? 0));
//   formData.append('reference', rest.reference ?? '');
  
//   const { data } = await stockLogicApi<CreateRestartStock>({
//     url: `/providers/${productId}`, 
//     method: "POST", 
//     data: formData,
//   });

//   return data;
// };

