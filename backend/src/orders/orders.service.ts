import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly productsService: ProductsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: number, dto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderItems: OrderItem[] = [];

      for (const item of dto.items) {
        const product = await this.productsService.findOne(item.productId);

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for "${product.name}". Available: ${product.stock}`,
          );
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        const orderItem = new OrderItem();
        orderItem.productId = product.id;
        orderItem.quantity = item.quantity;
        orderItem.price = product.price;
        orderItems.push(orderItem);
      }

      const order = new Order();
      order.userId = userId;
      order.items = orderItems;

      const savedOrder = await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return this.findOne(userId, savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByUser(userId: number, query: QueryOrderDto) {
    const { status, page = 1, limit = 20 } = query;

    const where: Record<string, unknown> = { userId };
    if (status) {
      where.status = status;
    }

    const [items, total] = await this.ordersRepository.findAndCount({
      where,
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: number, orderId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    return order;
  }
}
