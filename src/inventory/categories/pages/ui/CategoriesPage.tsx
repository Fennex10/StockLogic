import { Navigate, useNavigate, useParams } from 'react-router';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreemLoading';
import { CategoryForm } from './categoryForm';
import { toast } from 'sonner';
import type { CreateProduct } from '@/interface/products/create-product.interface';
import { useCategory } from '../../hooks/useCategory';

export const CategoriesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Hook de datos y mutación
  const { isLoading, isError, mutation, data: categories } = useCategory(id || 'new');

  // 2. Determinamos si es creación o edición a nivel de componente
  const isCreating = id === 'new';
//   const title = isCreating ? 'Nueva categoria' : 'Editar categoria';
//   const subtitle = isCreating 
//     ? 'Aquí puedes crear una nueva categoria.' 
//     : 'Aquí puedes editar categoria.';

  // 3. Función HandleSubmit Corregida
  const handleSubmit = async (productLike: Partial<CreateProduct> & { files?: File[] }) => {
    try {
      const productData = {
        ...productLike,
        id: isCreating ? undefined : id
      };

      await mutation.mutateAsync(productData);
      
      toast.success(isCreating ? 'Producto creado correctamente' : 'Producto actualizado correctamente', {
        position: 'top-right',
      });

      navigate('/dashboard/categories');
      
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      toast.error('Error al procesar la solicitud');
    }
  };

  // Primero errores de carga
  if (isError) return <Navigate to='/dashboard/products' />;
   
  // Estado de carga global
  if (isLoading ) return <CustomFullScreenLoading />;
  
  // Verificación de data (solo si no estamos cargando)
  if (!categories) return <Navigate to='/dashboard/products' />;

  return <CategoryForm
    //  title={title} 
    //  subTitle={subtitle} 
     category={categories}
     onSubmit={handleSubmit}
     isPending={mutation.isPending}
     />  
};