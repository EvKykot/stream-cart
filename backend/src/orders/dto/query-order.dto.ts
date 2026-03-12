import { IsOptional, IsNumber, Min, IsIn } from 'class-validator';
import { OrderStatus } from '../order.entity';

export class QueryOrderDto {
  @IsOptional()
  @IsIn(Object.values(OrderStatus))
  status?: OrderStatus;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
