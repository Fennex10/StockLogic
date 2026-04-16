import { stockLogicApi } from "@/api/stockLogicApi";
import type { AuthResponse } from "../interface/auth.Response";

export const activateUserAction = async ( 
  token: string ): Promise<AuthResponse> => { 
   try {

    const { data } = await stockLogicApi.post<AuthResponse>(`/auth/activate-user/${token}`); 
    console.log(data);        
    return data; 

  } catch (error){
    console.log(error)
    throw error   
  }
};