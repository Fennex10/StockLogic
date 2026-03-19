import { Navigate, useNavigate, useParams } from 'react-router';
import { useProduct } from '@/inventory/productos/hooks/useProduct';
import { useCategories } from '@/inventory/productos/hooks/useCategories';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreemLoading';
import { ProductForm } from './ProductsForm';
import { toast } from 'sonner';
import type { CreateProduct } from '@/interface/products/create-product.interface';


export const ProductPage = () => {
  // const { id } = useParams();
  // const navigate = useNavigate();

  // const {isLoading, isError, mutation, data: product} = useProduct(id || '')
  //   const { data: categories, isLoading: loadingCategories} = useCategories();

  // const title = id === 'new' ? 'Nuevo producto' : 'Editar producto';
  // const subtitle =
  //   id === 'new'
  //     ? 'Aquí puedes crear un nuevo producto.'
  //     : 'Aquí puedes editar el producto.';

  //  const handleSubmit = async(productLike: Partial<CreateProduct> ) => {
  //   await mutation.mutateAsync(productLike, {
  //     onSuccess: (data) => {
  //       toast.success('Producto actualizado correctamente', {
  //         position: 'top-right',
  //       });
  //       navigate(`/dashboard/products/${data.id}`)
  //     },
  //     onError: (error) => {
  //       console.log(error)
  //       toast.error('Error al actualizar el producto')
  //     }
  //   })
  //  }   

  // const handleSubmit = async (productLike: Partial<CreateProduct> & { files?: File[] }) => {
  //   try {
  //     // Aseguramos que el ID vaya en el objeto para la acción
  //     const productData = {
  //       ...productLike,
  //       id: isCreating ? undefined : id
  //     };

  //     await mutation.mutateAsync(productData);
      
  //     toast.success(isCreating ? 'Producto creado correctamente' : 'Producto actualizado correctamente', {
  //       position: 'top-right',
  //     });

  //     // Navegamos de vuelta a la lista
  //     navigate('/dashboard/products');
      
  //   } catch (error) {
  //     console.error('Error en handleSubmit:', error);
  //     toast.error('Error al procesar la solicitud');
  //   }
  // };

  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Hook de datos y mutación
  const { isLoading, isError, mutation, data: product } = useProduct(id || 'new');
  const { data: categories, isLoading: loadingCategories } = useCategories();

  // 2. Determinamos si es creación o edición a nivel de componente
  const isCreating = id === 'new';
  const title = isCreating ? 'Nuevo producto' : 'Editar producto';
  const subtitle = isCreating 
    ? 'Aquí puedes crear un nuevo producto.' 
    : 'Aquí puedes editar el producto.';

  // 3. Función HandleSubmit Corregida
  const handleSubmit = async (productLike: Partial<CreateProduct> & { files?: File[] }) => {
    try {
      // Aseguramos que el ID vaya en el objeto para la acción
      const productData = {
        ...productLike,
        id: isCreating ? undefined : id
      };

      await mutation.mutateAsync(productData);
      
      toast.success(isCreating ? 'Producto creado correctamente' : 'Producto actualizado correctamente', {
        position: 'top-right',
      });

      // Navegamos de vuelta a la lista
      navigate('/dashboard/products');
      
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      toast.error('Error al procesar la solicitud');
    }
  };

  // 1. Primero errores de carga
  if (isError) return <Navigate to='/dashboard/products' />;

  // 2. Estado de carga global
  if (isLoading || loadingCategories) return <CustomFullScreenLoading />;

  // 3. Verificación de data (solo si no estamos cargando)
  // Nota: Eliminamos el if(!product) agresivo para evitar bugs en 'new'
  if (!categories || !product) return <Navigate to='/dashboard/products' />;


  return <ProductForm 
     title={title} 
     subTitle={subtitle} 
     product={product} 
     categories={categories}
     onSubmit={handleSubmit}
     isPending={mutation.isPending}
     />
  
};