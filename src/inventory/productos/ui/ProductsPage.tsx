import { Navigate, useNavigate, useParams } from 'react-router';
import { useProduct } from '@/inventory/productos/hooks/useProduct';
import { useCategories } from '@/inventory/productos/hooks/useCategories';
import { CustomFullScreenLoading } from '@/components/custom/CustomFullScreemLoading';
import { ProductForm } from './ProductsForm';
import type { Products } from '@/interface/products/products.interface';
import { toast } from 'sonner';


export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {isLoading, isError, mutation, data: product} = useProduct(id || '')
    const { data: categories = [], isLoading: loadingCategories} = useCategories();

  const title = id === 'new' ? 'Nuevo producto' : 'Editar producto';
  const subtitle =
    id === 'new'
      ? 'Aquí puedes crear un nuevo producto.'
      : 'Aquí puedes editar el producto.';

   const handleSubmit = async(productLike: Partial<Products> & {files?: File[]}) => {
    await mutation.mutateAsync(productLike, {
      onSuccess: (data) => {
        toast.success('Producto actualizado correctamente', {
          position: 'top-right',
        });
        navigate(`/products/${data.id}`)
      },
      onError: (error) => {
        console.log(error)
        toast.error('Error al actualizar el producto')
      }
    })
   }   


  if (isError) {
    return <Navigate to='/productos' />
  }

  if (isLoading || loadingCategories) {
    return <CustomFullScreenLoading />
  }
  
  if (!categories) {
    return <Navigate to='/productos' />
  }
  if (!product) {
    return <Navigate to='/productos' />
  }

  return <ProductForm 
     title={title} 
     subTitle={subtitle} 
     product={product} 
     categories={categories}
     onSubmit={handleSubmit}
     isPending={mutation.isPending}
     />
  
};