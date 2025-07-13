export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  formatted_price: string;
  image?: string;
  images?: string[];
  description?: string;
  category_id: number;
  category?: Category;
  stock: number;
  rating?: number;
  in_stock: boolean;
  sku: string;
  weight: string;
  is_active: boolean;
  views: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
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

export interface Address {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AddressRequest {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  is_default?: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'expired';
  total_amount: number;
  shipping_cost: number;
  shipping_address: Address;
  items: OrderItem[];
  payment_method?: string;
  payment_token?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
  };
  payment_method?: string;
  notes?: string;
}

export interface CheckoutData {
  cart: Cart;
  addresses: Address[];
  selectedAddress: Address | null;
  shippingCost: number;
  totalAmount: number;
}

export interface PaymentTokenResponse {
  token: string;
  redirect_url: string;
}

export interface OrderResponse {
  data: Order;
}

export interface OrdersResponse extends PaginatedResponse<Order> {}

export interface AddressResponse {
  data: Address;
}

export interface AddressesResponse {
  data: Address[];
}