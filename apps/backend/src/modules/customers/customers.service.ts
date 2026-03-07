import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        _count: { select: { sales: true } },
        sales: {
          select: { total: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        sales: {
          include: {
            items: { include: { variant: { include: { product: true } } } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    return customer;
  }
}
