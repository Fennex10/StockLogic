import { stockLogicApi } from "@/api/stockLogicApi";
import type { CreateProvider } from "@/interface/providers/create-provider";
import type { Provider } from "@/interface/providers/provider.interface";
import { sleep } from "@/lib/sleep";


export const createUpdateProviderAction = async (
  providerLike: Partial<CreateProvider> & { files?: File[] }
): Promise<Provider> => {

  await sleep(1500);

  const { id, ...rest } = providerLike;
  const isCreating = !id || id === "new";

  const formData = new FormData();
  
  formData.append('providerName', rest.providerName ?? '');
  formData.append('providerTaxId', rest.providerTaxId ?? '');
  formData.append('providerContactName', rest.providerContactName ?? '');
  formData.append('providerEmail', rest.providerEmail ?? '');
  formData.append('providerPhone', rest.providerPhone ?? '');
  formData.append('providerAddress', rest.providerAddress ?? '');
  formData.append('providerWebsite', rest.providerWebsite ?? '');
  
  const { data } = await stockLogicApi<Provider>({
    url: isCreating ? "/providers" : `/providers/${id}`, 
    method: isCreating ? "POST" : "PUT",
    data: formData,
  });

  return data;
};

