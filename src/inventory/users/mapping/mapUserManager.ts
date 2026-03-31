import type { UserManager } from "@/interface/userManager/userManager.interface";
import type { CreateUserManager } from "@/interface/userManager/create-user-manager";


export const mapToCreateProvider = (u: UserManager): CreateUserManager => ({
  id: u.id || '',
  userName: u.name || '',
  userEmail: u.email || '',
  userPassword: u.password || '',
  userPasswordConfirm: u.password || '',
  userRoleId: u.roleId || '',
});
