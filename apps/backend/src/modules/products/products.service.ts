import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, images: true, variants: true },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: true,
        options: { include: { values: true } },
      },
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    const { variants, ...productData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data: productData });

      if (!variants?.length) return product;

      const optionMap = new Map<string, Set<string>>();
      for (const v of variants) {
        for (const c of v.combination) {
          if (!optionMap.has(c.optionName))
            optionMap.set(c.optionName, new Set());
          optionMap.get(c.optionName)!.add(c.value);
        }
      }

      const createdOptions = new Map<
        string,
        { id: string; values: Map<string, string> }
      >();
      for (const [optionName, optionValues] of optionMap.entries()) {
        const option = await tx.productOption.create({
          data: {
            name: optionName,
            productId: product.id,
            values: { create: [...optionValues].map((v) => ({ value: v })) },
          },
          include: { values: true },
        });
        const valueMap = new Map<string, string>(
          (option.values as Array<{ id: string; value: string }>).map(
            (v): [string, string] => [v.value, v.id],
          ),
        );
        createdOptions.set(optionName, { id: option.id, values: valueMap });
      }

      for (const v of variants) {
        const variant = await tx.productVariant.create({
          data: {
            price: v.price,
            sku: v.sku,
            stock: v.stock,
            productId: product.id,
          },
        });

        for (const c of v.combination) {
          const option = createdOptions.get(c.optionName)!;
          await tx.variantOptionValue.create({
            data: {
              variantId: variant.id,
              optionId: option.id,
              valueId: option.values.get(c.value)!,
            },
          });
        }
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: { variants: true, options: { include: { values: true } } },
      });
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const { categoryId, ...rest } = dto;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
