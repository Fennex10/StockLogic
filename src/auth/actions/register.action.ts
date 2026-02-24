import { stockLogicApi } from "@/api/stockLogicApi"
import type { AuthResponse } from "../interface/auth.Response"

export const registerAction = async (
    companyName: string, 
    userName: string,
    companyEmail: string,
    userPassword: string,
    userPasswordConfirm: string,
): Promise<AuthResponse> => {
   try {
      const {data} = await stockLogicApi.post<AuthResponse>('/auth/register', {
        companyName,
        userName,
        companyEmail,
        userPassword,
        userPasswordConfirm,
      })
      return data;

   } catch (error){
     console.log(error)
     throw error   
   }
} 