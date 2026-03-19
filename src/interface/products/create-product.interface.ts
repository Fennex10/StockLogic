
export interface CreateProduct {  
  id: string;
  productName: string;           
  productDescription: string;    
  productPrice: number;          
  productCostPrice: number;      
  productCurrentStock: number;   
  productMinStock: number;       
  productMaxStock: number;       
  productCategoryId: string;     
  productImage: string;          
}