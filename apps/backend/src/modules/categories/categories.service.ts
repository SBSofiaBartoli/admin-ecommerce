import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (this.prisma.category as any).findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const category = await (this.prisma.category as any).findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return (this.prisma.category as any).update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.prisma.category as any).delete({ where: { id } });
  }
}
