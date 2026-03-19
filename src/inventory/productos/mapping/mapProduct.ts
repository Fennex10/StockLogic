import type { Product } from "@/interface/products/product.interface";
import type { CreateProduct } from "@/interface/products/create-product.interface";

export const mapToCreateProduct = (p: Product): CreateProduct => ({
  id: p.id,
  productName: p.name,
  productDescription: p.description,
  productPrice: p.price,
  productCostPrice: p.costPrice,
  productCurrentStock: p.currentStock,
  productMinStock: p.minStock,
  productMaxStock: p.maxStock,
  productCategoryId: p.categoryId,
  productProviderId: p.providerId,
  productImage: p.imageURL
});