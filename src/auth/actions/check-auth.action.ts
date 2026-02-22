import { stockLogicApi } from "@/api/stockLogicApi";
import type { AuthResponse } from "../interface/auth.Response";

export const checkAuthAction = async() : Promise<AuthResponse> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    try {
       const {data} = await stockLogicApi.get<AuthResponse>('/auth/check-status');
       localStorage.setItem('token', data.token);
       return data;
    } catch (error) {
       console.log(error);
       localStorage.removeItem('token');
       throw new Error('Token expired or not valid')
    }
}



