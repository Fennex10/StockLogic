import { Navigate, useNavigate, useParams } from 'react-router';
import { useProduct } from '@/inventory/productos/hooks/useProduct';
import { useCategories } from '@/inventory/categories/hooks/useCategories';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreemLoading';
import { ProductForm } from './ProductsForm';
import { toast } from 'sonner';
import type { CreateProduct } from '@/interface/products/create-product.interface';
import { useProviders } from '@/inventory/providers/hooks/useProviders';

export const ProductPage = () => {
  const { id } = useParams();
  console.log("ID capturado de la URL:", id);
  const navigate = useNavigate();

  // 1. Hook de datos y mutación
  const { isLoading, isError, mutation, data: product } = useProduct(id || 'new');
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const {data: providers, isLoading: loadingProviders} = useProviders();

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

      navigate('/dashboard/products');
      
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      toast.error('Error al procesar la solicitud');
    }
  };

  // Primero errores de carga
  if (isError) return <Navigate to='/dashboard/products' />;
   
  // Estado de carga global
  if (isLoading || loadingCategories || loadingProviders) return <CustomFullScreenLoading />;
  
//   if (id !== 'new' && product?.id !== id) {
//   return <CustomFullScreenLoading />;
// }

// 2. Si no hay producto y no es 'new', manejamos el error
  if (!product && id !== 'new') return <div>Producto no encontrado</div>;
  // Verificación de data (solo si no estamos cargando)
  if (!categories || !product || !providers) return <Navigate to='/dashboard/products' />;


  return <ProductForm 
     title={title} 
     subTitle={subtitle} 
     product={product} 
     categories={categories}
     providers={providers}
     onSubmit={handleSubmit}
     isPending={mutation.isPending}
     />  
};