export class QueryProductDto {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'createdAt';
  order?: 'ASC' | 'DESC';
}
