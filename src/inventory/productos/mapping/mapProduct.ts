import type { Product } from "@/interface/products/product.interface";
import type { CreateProduct } from "@/interface/products/create-product.interface";

export const mapToCreateProduct = (p: Product): CreateProduct => ({
  id: p.id || '',
  productName: p.name || '',
  productDescription: p.description || '',
  productPrice: p.price,
  productCostPrice: p.costPrice || 0,
  productCurrentStock: p.currentStock || 0,
  productMinStock: p.minStock || 0,
  productMaxStock: p.maxStock || 0,
  productCategoryId: p.categoryId || '',
  productProviderId: p.providerId || '',
  productImage: p.imageURL || ''
});
