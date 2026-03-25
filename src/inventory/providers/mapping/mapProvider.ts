import type { Provider } from "@/interface/providers/provider.interface";
import type { CreateProvider } from "@/interface/providers/create-provider";


export const mapToCreateProvider = (p: Provider): CreateProvider => ({
  id: p.id || '',
  providerName: p.name || '',
  providerTaxId: p.taxId || '',
  providerContactName: p.contactName || '',
  providerEmail: p.email || '',
  providerPhone: p.phone || '',
  providerAddress: p.address || '',
  providerWebsite: p.website || '',
});
