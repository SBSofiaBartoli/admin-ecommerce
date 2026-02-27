import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateSaleDto) {
    return this.prisma.sale.create({ data: dto });
  }
}
