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
    return this.prisma.category.findMany({
      orderBy: { position: 'asc' },
      include: {
        parent: true,
        _count: {
          select: { children: true },
        },
      },
    });
  }

  async findForSelect() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        position: true,
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async findChildren(parentId: string) {
    return this.prisma.category.findMany({
      where: { parentId },
      orderBy: { position: 'asc' },
    });
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
    const existing = await this.prisma.category.findFirst({
      where: {
        name: dto.name,
        parentId: dto.parentId ?? null,
      },
    });
    if (existing) {
      throw new BadRequestException(
        'A category with that name already exists in this parent category',
      );
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
    if (dto.name) {
      const existing = await this.prisma.category.findFirst({
        where: {
          name: dto.name,
          parentId: dto.parentId ?? null,
          NOT: { id },
        },
      });
      if (existing) {
        throw new BadRequestException(
          'A category with that name already exists in this parent category',
        );
      }
    }
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
