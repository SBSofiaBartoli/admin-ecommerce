import { Injectable } from '@nestjs/common';
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
    const statuses: SaleStatus[] = [
      'PREPARATION',
      'SHIPPED',
      'COMPLETED',
      'CANCELLED',
    ];
    const paymentStatuses: PaymentStatus[] = ['PAID', 'FAILED'];
    const paymentMethods = [
      'Tarjeta de Crédito',
      'Tarjeta de Débito',
      'Transferencia',
      'Efectivo',
    ];

    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPayment =
      paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const randomMethod =
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const randomTotal = Math.floor(Math.random() * 50000) / 100 + 10;

    return this.prisma.sale.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        status: randomStatus,
        paymentStatus: randomPayment,
        paymentMethod: randomMethod,
        total: randomTotal,
        customer: {
          create: {
            id: randomUUID(),
            name: 'Cliente Demo',
            email: `demo-${Date.now()}@demo.com`,
          },
        },
        history: {
          create: {
            id: randomUUID(),
            status: randomStatus,
            note: `Pedido creado con estado ${randomStatus}`,
          },
        },
        shipment: {
          create: {
            id: randomUUID(),
            carrier: 'OCA',
            tracking: `TRACK-${Date.now()}`,
            shippedAt:
              randomStatus === 'SHIPPED' || randomStatus === 'COMPLETED'
                ? new Date().toISOString()
                : null,
          },
        },
      },
      include: {
        customer: true,
        history: true,
        shipment: true,
      },
    });
  }

  async updateStatus(id: string, status: SaleStatus) {
    return this.prisma.sale.update({
      where: { id },
      data: { status },
    });
  }
}
