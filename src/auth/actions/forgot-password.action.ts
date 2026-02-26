import { stockLogicApi } from "@/api/stockLogicApi"
import type { AuthResponse } from "@/auth/interface/auth.Response";

export const forgotPasswordAction = async (
    userEmail: string,
): Promise<AuthResponse> => {
   try {
      const {data} = await stockLogicApi.post<AuthResponse>('/auth/forgot-password', {
         userEmail,
      })
      return data;

   } catch (error){
    console.log(error)
    throw error   
}
} 

