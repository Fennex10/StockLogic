import { stockLogicApi } from "@/api/stockLogicApi";
import type { UserManagersResponse } from "@/interface/userManager/userManagers.response";

export const getUsersAction = async (): Promise<UserManagersResponse> => {
    
    const {data} = await stockLogicApi.get<UserManagersResponse>(`/users`);  
    return data;
}

