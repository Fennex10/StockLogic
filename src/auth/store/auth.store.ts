import type { User } from '@/interface/user.interface'
import { create } from 'zustand'
import { loginAction } from '../actions/login.action';
import { checkAuthAction } from '../actions/check-auth.action';
import { registerAction } from '../actions/register.action';
import { forgotPasswordAction } from '../actions/forgot-password.action';
import { resetPasswordAction } from '../actions/reset-password.action';

type AuthStatus = 'authenticated' | 'not-authenticated' |'checking';

type AuthState = { 
    // Properties
    user: User | null;
    token: string | null;
    authStatus: AuthStatus;
    //Getters
    isAdmin: () => boolean;
    //Action
    login: (userEmail: string, userPassword: string) => Promise<boolean>;
    logout: () => void;
    checkAuthStatus: () => Promise<boolean>;

    register: (companyName: string, userName: string, companyEmail: string,
               userPassword: string, userPasswordConfirm: string) => Promise<boolean>;

    forgotPassword: (userEmail: string) => Promise<boolean>;
    resetPassword: ( userPassword: string, userPasswordConfirm: string, userPasswordToken: string) => Promise<boolean>; 
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    user: null,
    token: null,
    authStatus: 'checking',
    
    isAdmin: () => {
        const roles = get().user?.roleId;

        if (roles) {
            return roles == 1 //Super_Admin
        }
        if (roles) {
            return roles == 2 // Admin
        }
        return roles == 3;  // Employee 
        //1. Super_Admin, 2. Admin, 3. Employee
    //    const roles = get().user?.roles || [];
    //    return roles.includes('admin');
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
    
     register: async(companyName: string, userName: string, companyEmail: string,
               userPassword: string, userPasswordConfirm: string) => {
        
        try {
            const data = await registerAction(companyName, userName, companyEmail, userPassword, userPasswordConfirm);
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

    forgotPassword: async(userEmail: string) => {
        
        try {
            const data = await forgotPasswordAction(userEmail);
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

     resetPassword: async(userPassword: string, userPasswordConfirm: string, userPasswordToken: string) => {
        
        try {
            const data = await resetPasswordAction(userPassword, userPasswordConfirm, userPasswordToken);
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
}))


