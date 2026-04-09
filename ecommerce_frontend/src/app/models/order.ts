export interface Order {
    id: number;
  productName: string;
  quantity: number;
  price: number;
  status: string;
  image?: string;
  orderedAt: string;
}
