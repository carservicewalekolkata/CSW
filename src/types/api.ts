export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  limit: number;
  cacheKey?: string;
  timestamp: string;
  data: T[];
  message?: string;
}

export interface Service {
  id: string;
  name: string;
  category_id: number;
  category_name: string;
  service_images: string[];
  thumbnail: string | null;
  description: string | null;
  features: string[];
  time_taken: string | null;
  warranty: string | null;
  status: boolean;
  created_date: string | null;
  updated_date: string | null;
}

export interface ServiceCategory {
  id: number;
  name: string;
  created_date: string | null;
  updated_date: string | null;
}

export interface Brand {
  name: string;
  slug: string;
  status: boolean;
  icon: string | null;
  created_date: string | null;
  updated_date: string | null;
}

export interface ModelService {
  services_id: string;
  discount: number;
  original_price: number;
  discount_price: number;
}

export interface Model {
  id: number;
  name: string;
  slug: string;
  brand_id: number;
  brand_name: string;
  body_type: string | null;
  fuel_type: string[];
  thumbnail: string | null;
  image: string | null;
  services: ModelService[];
  status: boolean;
  created_date: string | null;
  updated_date: string | null;
}

export type ServiceResponse = ApiListResponse<Service>;
export type ServiceCategoryResponse = ApiListResponse<ServiceCategory>;
export type BrandResponse = ApiListResponse<Brand>;
export type ModelResponse = ApiListResponse<Model>;
