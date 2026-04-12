import type { User } from '@/interface/user/user.interface'
import { create } from 'zustand'
import { loginAction } from '../actions/login.action';
import { checkAuthAction } from '../actions/check-auth.action';
import { registerAction } from '../actions/register.action';
import { forgotPasswordAction } from '../actions/forgot-password.action';
import { resetPasswordAction } from '../actions/reset-password.action';
import { RoleCode } from '../type/roleCode';
import { activateUserAction } from '../actions/activate-user';

type AuthStatus = 'authenticated' | 'not-authenticated' |'checking';

type AuthState = { 
    // Properties
    user: User | null;
    token: string | null;
    authStatus: AuthStatus;
    //Getters
    // isAdmin: () => boolean;
    hasRole: (role: RoleCode) => boolean;
    //Action
    login: (userEmail: string, userPassword: string) => Promise<boolean>;
    logout: () => void;
    checkAuthStatus: () => Promise<boolean>;

    register: (companyName: string, userName: string, companyEmail: string,
               userPassword: string, userPasswordConfirm: string) => Promise<boolean>;

    forgotPassword: (userEmail: string) => Promise<boolean>;

    resetPassword:  (userPassword: string, userPasswordConfirm: string, 
                    userPasswordToken: string) => Promise<boolean>; 
    
    activateUser: (token: string) => Promise<boolean>

}

export const useAuthStore = create<AuthState>()((set, get) => ({
    user: null,
    token: null,
    authStatus: 'checking',
    
    //Antigua implementacion 
    // isAdmin: () => {
    //    const roles = get().user?.roleCode || String;
    //    return roles.includes(RoleCode.ADMIN);
    // },

    hasRole: (role: RoleCode) => {
        const userRole = get().user?.roleCode;
        return userRole === role || userRole === RoleCode.SUPER_ADMIN;
    },
   
    login: async(userEmail: string, userPassword: string) => {
        try {
             const data = await loginAction(userEmail, userPassword);
             localStorage.setItem('token', data.token);

             set({user: data.user, token: data.token, authStatus:'authenticated'})
             return true;

        } catch (error) {
           console.log(error)
           localStorage.removeItem('token');
           set({user: null, token: null, authStatus:'not-authenticated'})
           return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({user: null, token: null, authStatus: 'not-authenticated'})
    },

    checkAuthStatus: async() => {
       set({ authStatus: 'checking' });

       try {
          const {user, token} = await checkAuthAction();       
          set({
            user: user,
            token: token,
            authStatus: 'authenticated'
          });
          return true;
       } catch {
          set({
            user: undefined,
            token: undefined,
            authStatus: 'not-authenticated',
          });
          return false;
       }
    },

    register: async (companyName: string, userName: string, companyEmail: string,
        userPassword: string, userPasswordConfirm: string
        ) => {

        try {
            await registerAction(companyName, userName, companyEmail,
            userPassword, userPasswordConfirm );

            localStorage.removeItem('token');
            
            set({user: null, token: null, authStatus: 'not-authenticated'});

            return true;

        } catch (error) {
            console.log(error);
            localStorage.removeItem('token');
            set({ user: null, token: null, authStatus: 'not-authenticated'});
            return false;
        }
    },

    activateUser: async (token: string) => {
        try {
            const data = await activateUserAction(token);

            localStorage.setItem('token', data.token);

            set({
            user: data.user,
            token: data.token,
            authStatus: 'authenticated',
            });

            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
        },

    forgotPassword: async (userEmail: string) => {
        try {
            await forgotPasswordAction(userEmail);
            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    },

     resetPassword: async(userPassword: string, userPasswordConfirm: string, userPasswordToken: string) => {
        
        try {
            const data = await resetPasswordAction(userPassword, userPasswordConfirm, userPasswordToken);
            localStorage.setItem('token', data.token);

            set({user: data.user, 
                token: data.token, 
                authStatus:'authenticated'})
            return true;

        } catch (error) {
           console.log(error)
           return false;
        }
    },
}))


