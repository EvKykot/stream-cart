import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Request() req: { user: { id: number } },
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get()
  findAll(
    @Request() req: { user: { id: number } },
    @Query() query: QueryOrderDto,
  ) {
    return this.ordersService.findAllByUser(req.user.id, query);
  }

  @Get(':id')
  findOne(
    @Request() req: { user: { id: number } },
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ordersService.findOne(req.user.id, id);
  }
}
