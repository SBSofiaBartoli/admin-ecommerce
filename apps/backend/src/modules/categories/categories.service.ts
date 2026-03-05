import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return (this.prisma.category as any).findMany({
      where: { parentId: null },
      orderBy: { position: 'asc' },
      include: {
        children: {
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  async findForSelect() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        parentId: true,
      },
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
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new BadRequestException('Parent category not found');
      }
    }
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new BadRequestException('Parent category not found');
      }
    }
    return (this.prisma.category as any).update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.prisma.category as any).delete({ where: { id } });
  }
}
