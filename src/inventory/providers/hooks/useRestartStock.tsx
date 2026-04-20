import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateRestartStock } from "@/interface/providers/create-restart-stock";
import { createRestartStockAction } from "../action/create-restart-stock";
import { getRestartStockByIdAction } from "../action/get-restart-stock.action";


export const useRestartStock = (id: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['restartStock', id],
    queryFn: () => getRestartStockByIdAction(id),
    enabled: id !== "new", // Evita que intente pedir datos si el id es "new"
    retry: false,
    staleTime: 1000 * 60 * 5
  });

  const mutation = useMutation({
    mutationFn: createRestartStockAction,
    onSuccess: (restartStock: CreateRestartStock) => {
      // 1. Invalida el historial de reabastecimiento
      queryClient.invalidateQueries({ queryKey: ['restartStock'] });
      
      // 2. IMPORTANTE: Invalida la lista de productos
      // Esto hará que el stock actual y los gráficos se actualicen automáticamente
      queryClient.invalidateQueries({ queryKey: ['products'] });

      // 3. Invalida las estadísticas de ventas/proveedores
      // Así el KPI de "Inversión Total" que vimos en tu componente Providers se refresca
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });

      // 4. Actualización manual del caché específico
      queryClient.setQueryData(['restartStock', id], restartStock);

      // 5. Invalida el proveedor específico si el objeto de respuesta lo requiere
      queryClient.invalidateQueries({
        queryKey: ['provider', { id: restartStock.productId }]
      });
    }
  });

  return {
    ...query,
    mutation
  };
};

// export const useRestartStock = (id: string) => {
  
//   const queryClient = useQueryClient();

//   const query = useQuery({
//     queryKey: ['restartStock', id],
//     queryFn: () => getRestartStockByIdAction(id),
//     retry: false,
//     staleTime: 1000 * 60 * 5
//   });

//   const mutation = useMutation({
//     mutationFn: createRestartStockAction,
//     onSuccess: (restartStock: CreateRestartStock) => {
      
//       queryClient.invalidateQueries({ queryKey: ['restartStock'] }); 
//       queryClient.invalidateQueries({ queryKey: ['restartStock', id] });
//       queryClient.setQueryData(['restartStock', id], restartStock);

//       queryClient.invalidateQueries({
//         queryKey: ['provider', { id: restartStock.productId }]
//       });
//     }
//   });

//   return {
//     ...query,
//     mutation
//   }
// }

  // const mutation = useMutation({
  //   mutationFn: createRestartStockAction,
  //   onSuccess: (restartStock: CreateRestartStock) => {
  //     //Invalidate cache
  //     queryClient.invalidateQueries({queryKey: ['restartStocks']});
  //     queryClient.invalidateQueries({
  //       queryKey: ['provider', {id: restartStock.productId}]
  //     });
  //     //Update queryData
  //     queryClient.setQueryData(['restartStocks', {id: restartStock.productId}], restartStock);
  //   }
  // })
