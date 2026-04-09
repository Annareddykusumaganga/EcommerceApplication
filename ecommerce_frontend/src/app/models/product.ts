export interface Product {
  id?: number;
    name: string;
  price: number;
  category: string;
  quantity: number;
  description: string;
  image: string | File;
   // Add optional property for template usage
  showFullDesc?: boolean;
}
