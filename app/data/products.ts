export type Category = 'HT' | 'Jasa Broadcasting' | 'Paket';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  image: string;
  features: string[];
  specs: Record<string, string>;
  stock: number;
}


