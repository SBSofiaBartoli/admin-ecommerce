import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, SaleStatus } from '@prisma/client';
import { randomUUID } from 'node:crypto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sale.findMany({
      include: {
        customer: true,
        history: true,
        shipment: true,
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create() {
    const paymentStatuses: PaymentStatus[] = ['PAID', 'FAILED'];
    const paymentMethods = [
      'Tarjeta de Crédito',
      'Tarjeta de Débito',
      'Transferencia',
      'Efectivo',
    ];

    const availableVariants = await this.prisma.productVariant.findMany({
      where: { stock: { gt: 0 } },
      include: { product: true },
    });

    if (!availableVariants.length) {
      throw new BadRequestException('No hay variantes con stock disponible');
    }

    const shuffled = availableVariants.sort(() => Math.random() - 0.5);
    const selectedVariants = shuffled.slice(0, Math.min(3, shuffled.length));
    const customers = await this.prisma.customer.findMany();
    if (!customers.length) {
      throw new BadRequestException('No hay clientes disponibles');
    }
    const randomCustomer =
      customers[Math.floor(Math.random() * customers.length)];
    const randomPayment =
      paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const randomMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const randomStatus: SaleStatus = 'PREPARATION';
    const total = selectedVariants.reduce((sum, v) => sum + v.price, 0);

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          id: randomUUID(),
          orderNumber: `ORD-${Date.now()}`,
          status: randomStatus,
          paymentStatus: randomPayment,
          paymentMethod: randomMethod,
          total,
          customerId: randomCustomer.id,
          history: {
            create: {
              id: randomUUID(),
              status: randomStatus,
              note: 'Pedido creado',
            },
          },
          shipment: {
            create: {
              id: randomUUID(),
              carrier: 'OCA',
              tracking: `TRACK-${Date.now()}`,
              shippedAt: null,
            },
          },
        },
      });

      for (const variant of selectedVariants) {
        await tx.saleItem.create({
          data: {
            id: randomUUID(),
            saleId: sale.id,
            variantId: variant.id,
            quantity: 1,
            price: variant.price,
          },
        });

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: 1 } },
        });
      }

      return tx.sale.findUnique({
        where: { id: sale.id },
        include: {
          customer: true,
          history: true,
          shipment: true,
          items: {
            include: { variant: { include: { product: true } } },
          },
        },
      });
    });
  }

  async updateStatus(id: string, status: SaleStatus, note?: string) {
    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.update({
        where: { id },
        data: { status },
      });

      await tx.saleHistory.create({
        data: {
          id: randomUUID(),
          saleId: id,
          status,
          note: note ?? null,
        },
      });

      return sale;
    });
  }
}
