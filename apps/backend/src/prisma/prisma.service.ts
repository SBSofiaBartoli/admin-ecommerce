import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    this.client = new PrismaClient({ adapter });
  }

  get category() {
    return this.client.category;
  }
  get product() {
    return this.client.product;
  }
  get sale() {
    return this.client.sale;
  }
  get user() {
    return this.client.user;
  }

  get productVariant() {
    return this.client.productVariant;
  }

  get $transaction() {
    return this.client.$transaction.bind(this.client);
  }

  async onModuleInit() {
    await this.client.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
