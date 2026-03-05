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
            variant: {
              include: {
                product: true,
                values: {
                  include: {
                    option: true,
                    value: true,
                  },
                },
              },
            },
          },
        },
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateSaleDto) {
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: dto.items.map((i) => i.variantId) } },
    });
    if (variants.length !== dto.items.length) {
      throw new NotFoundException('Variant not found');
    }

    const items = dto.items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) throw new NotFoundException('Variant not found');
      return {
        variantId: variant.id,
        quantity: item.quantity,
        price: variant.price,
      };
    });

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return this.prisma.sale.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        total,
        customer: {
          connect: { id: dto.customerId },
        },
        items: {
          create: items.map((item) => ({
            variant: {
              connect: { id: item.variantId },
            },
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
        customer: true,
      },
    });
  }
}
