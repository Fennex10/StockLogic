import type { Product } from "@/interface/products/product.interface";
import type { CreateProduct } from "@/interface/products/create-product.interface";

// export const mapToCreateProduct = (p: Product): CreateProduct => ({
//   id: p.id || '',
//   productName: p.name || '',
//   productDescription: p.description || '',
//   productPrice: p.price,
//   productCostPrice: p.costPrice || 0,
//   productCurrentStock: p.currentStock || 0,
//   productMinStock: p.minStock || 0,
//   productMaxStock: p.maxStock || 0,
//   productCategoryId: p.categoryId || '',
//   productProviderId: p.providerId || '',
//   productImage: p.imageURL || ''
// });

export const mapToCreateProduct = (product: Product): CreateProduct => {
  return {
    id: product.id,
    productName: product.name || '',           // Traduce 'name' a 'productName'
    productDescription: product.description || '',
    productPrice: product.price || 0,
    productCostPrice: product.costPrice || 0,
    productCurrentStock: product.currentStock || 0,
    productMinStock: product.minStock || 0,
    productMaxStock: product.maxStock || 0,
    productCategoryId: product.categoryId || '',
    productProviderId: product.providerId || '', // Verifica que el backend envíe esto
  };
};
