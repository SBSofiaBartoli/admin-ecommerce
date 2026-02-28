import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateSaleDto) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: dto.items.map((i) => i.productId) } },
    });

    const items = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new NotFoundException();
      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return this.prisma.sale.create({
      data: {
        total,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }
}
