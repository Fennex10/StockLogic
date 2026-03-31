import { stockLogicApi } from "@/api/stockLogicApi";

export const activateUserAction = async (token: string) => {
  const { data } = await stockLogicApi.get(`/auth/activate?token=${token}`);
  return data;
};