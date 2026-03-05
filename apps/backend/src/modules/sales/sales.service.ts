import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        customer: true,
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
        history: true,
        shipment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create() {
    return this.prisma.sale.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        status: 'PREPARATION',
        paymentStatus: 'PAID',
        total: 0,
        customer: {
          create: {
            name: 'Cliente Demo',
            email: `demo-${Date.now()}@demo.com`,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return (this.prisma.sale as any).update({
      where: { id },
      data: { status },
    });
  }
}
