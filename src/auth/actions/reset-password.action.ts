import { stockLogicApi } from "@/api/stockLogicApi"
import type { AuthResponse } from "@/auth/interface/auth.Response";

export const resetPasswordAction = async (
    userPassword: string,
    userPasswordConfirm: string,
    userPasswordToken: string
): Promise<AuthResponse> => {
   try {
      const {data} = await stockLogicApi.post<AuthResponse>('/auth/reset-password', {
         userPassword,
         userPasswordConfirm,
         userPasswordToken
      })
      return data;

   } catch (error){
    console.log(error)
    throw error   
   }
} 

