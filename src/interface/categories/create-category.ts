
export interface CreateCategory {  
  id: string;
  productName: string;           
  productDescription: string;    
  productPrice: number;          
  productCostPrice: number;      
  productCurrentStock: number;   
  productMinStock: number;       
  productMaxStock: number;       
  productCategoryId: string;
  productProviderId: string;       
  productImage: string;          
}