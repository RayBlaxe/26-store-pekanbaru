export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  category_id: number;
  category?: Category;
  stock: number;
  rating?: number;
  in_stock: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  created_at?: string;
  updated_at?: string;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
  total: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProductsResponse extends PaginatedResponse<Product> {}

export interface CategoriesResponse {
  data: Category[];
}

export interface CartResponse {
  data: Cart;
}

export interface ProductFilters {
  category?: number;
  min_price?: number;
  max_price?: number;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}