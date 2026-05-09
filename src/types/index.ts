export interface ProductSpecs {
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  price: number;
  regularPrice: number;
  salePrice: number | null;
  stock: number;
  specs: ProductSpecs;
  description: string;
  shortDescription: string;
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
