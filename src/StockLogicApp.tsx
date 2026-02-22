import { RouterProvider } from "react-router"
import { appRouter } from "./router/app.router"
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CustomFullScreenLoading } from "./components/custom/CustomFullScreemLoading";
import type { PropsWithChildren } from "react";
import {Toaster} from 'sonner'
import { useAuthStore } from "./auth/store/auth.store";

const queryClient = new QueryClient();

const CheckAuthProvider = ({children}: PropsWithChildren) => {
   
   const {checkAuthStatus} = useAuthStore();
  
   const {isLoading} = useQuery({
      queryKey: ['auth'],
      queryFn: checkAuthStatus,
      retry: false,
      refetchInterval: 1000 * 60 * 1.5,
      refetchOnWindowFocus: true,
    });

    if (isLoading) return <CustomFullScreenLoading/>

    return children;
}

export const StockLogicApp = () => {
  
  return (
      
       <QueryClientProvider client={queryClient}>
         <Toaster/> 

           {/* Custom Provider   */}
           <CheckAuthProvider>
           <RouterProvider router={appRouter}/>
           </CheckAuthProvider>

         <ReactQueryDevtools initialIsOpen={false}/>
       </QueryClientProvider>
  )
}
