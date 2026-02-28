import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (this.prisma.product as any).findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await (this.prisma.product as any).findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    return (this.prisma.product as any).create({ data: dto });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return (this.prisma.product as any).update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.prisma.product as any).delete({ where: { id } });
  }
}
