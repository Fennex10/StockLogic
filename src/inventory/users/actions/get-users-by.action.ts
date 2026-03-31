import { stockLogicApi } from "@/api/stockLogicApi";
import type { UserManager } from "@/interface/userManager/userManager.interface";
import type { UserManagerResponse } from "@/interface/userManager/userManager.response";
import type { Role } from "@/interface/userManager/userManagerRole";

export const getUserManagerByIdAction = async (id: string): Promise<UserManager> => {
    if (!id || id === 'undefined') throw new Error('Id is required');

    if (id === 'new') {
        return {
            id: 'new',
            name: '',
            email:        '',
            password: '',
            activateToken: '',
            activateTokenExpiration: new Date(),
            resetToken: null,
            resetTokenExpiration: null,
            isActive: true,
            companyId: '',
            roleId: '',
            Role: {} as Role,
            createdAt: new Date(),
            updatedAt: new Date(),  
        }
    }
        
    const {data} = await stockLogicApi.get<UserManagerResponse>(`/users/${id}`);
    return data.data; 
}

