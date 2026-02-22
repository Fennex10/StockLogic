import { stockLogicApi } from "@/api/stockLogicApi"
import type { AuthResponse } from "@/auth/interface/auth.Response";

export const loginAction = async (
    userEmail: string,
    userPassword: string,
): Promise<AuthResponse> => {
   try {
      const {data} = await stockLogicApi.post<AuthResponse>('/auth/login', {
        userEmail,
        userPassword,
      })
      return data;

   } catch (error){
    console.log(error)
    throw error   
}
} 

