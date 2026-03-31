import { stockLogicApi } from "@/api/stockLogicApi";
import type { CreateUserManager } from "@/interface/userManager/create-user-manager";
import type { UserManager } from "@/interface/userManager/userManager.interface";
import { sleep } from "@/lib/sleep";

export const createUpdateUsersManagerAction = async (
  providerLike: Partial<CreateUserManager> 
): Promise<UserManager> => {

  await sleep(1500);

  const { id, ...rest } = providerLike;
  const isCreating = !id || id === "new";

  const formData = new FormData();
  
  formData.append('userName', rest.userName ?? '');
  formData.append('userEmail', rest.userEmail ?? '');
  formData.append('userPassword', rest.userPassword ?? '');
  formData.append('userPasswordConfirm', rest.userPasswordConfirm ?? '');
  formData.append('userRoleId', rest.userRoleId ?? '');
  
  const { data } = await stockLogicApi<UserManager>({
    url: isCreating ? "/users/register" : `/users/${id}`, 
    method: isCreating ? "POST" : "PUT",
    data: formData,
  });

  return data;
};

