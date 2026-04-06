import { stockLogicApi } from "@/api/stockLogicApi";
import type { UserRolesResponse } from "@/interface/userManager/roles/roles.response";


export const getUserRolesAction = async (): Promise<UserRolesResponse> => {
    
    const {data} = await stockLogicApi.get<UserRolesResponse>(`/roles`);  
    return data;
}

