import { stockLogicApi } from "@/api/stockLogicApi";
import type { UserManager } from "@/interface/userManager/userManager.interface";

export const deleteUserManagersByAction = async (id: string): Promise<UserManager> => {
    
    const {data} = await stockLogicApi.patch<UserManager>(`/users/${id}`);      
    return data;
}

