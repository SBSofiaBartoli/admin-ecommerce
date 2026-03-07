import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { randomUUID } from 'crypto';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'admin@admin.com',
      password: hashedPassword,
    },
  });

  const parentNames = ['Hombre', 'Mujer', 'Niño', 'Unisex'];
  const parents: Record<string, string> = {};

  for (let i = 0; i < parentNames.length; i++) {
    const name = parentNames[i];
    const existing = await prisma.category.findFirst({
      where: { name, parentId: null },
    });
    if (existing) {
      parents[name] = existing.id;
    } else {
      const created = await prisma.category.create({
        data: { id: randomUUID(), name, position: i },
      });
      parents[name] = created.id;
    }
  }

  const subCategoryDefs = [
    { name: 'Remeras', parent: 'Hombre' },
    { name: 'Pantalones', parent: 'Hombre' },
    { name: 'Zapatillas', parent: 'Hombre' },
    { name: 'Camperas', parent: 'Hombre' },
    { name: 'Remeras', parent: 'Mujer' },
    { name: 'Vestidos', parent: 'Mujer' },
    { name: 'Zapatillas', parent: 'Mujer' },
    { name: 'Camperas', parent: 'Mujer' },
    { name: 'Remeras', parent: 'Niño' },
    { name: 'Pantalones', parent: 'Niño' },
    { name: 'Buzos', parent: 'Unisex' },
    { name: 'Gorras', parent: 'Unisex' },
  ];

  const subCategories: Record<string, string> = {};

  for (let i = 0; i < subCategoryDefs.length; i++) {
    const { name, parent } = subCategoryDefs[i];
    const key = `${name}-${parent}`;
    const existing = await prisma.category.findFirst({
      where: { name, parentId: parents[parent] },
    });
    if (existing) {
      subCategories[key] = existing.id;
    } else {
      const created = await prisma.category.create({
        data: {
          id: randomUUID(),
          name,
          parentId: parents[parent],
          position: i,
        },
      });
      subCategories[key] = created.id;
    }
  }

  const productDefs = [
    {
      name: 'Remera Básica Hombre',
      brand: 'Nike',
      gender: 'Hombre',
      categoryKey: 'Remeras-Hombre',
      options: [
        { name: 'Talle', values: ['S', 'M', 'L', 'XL'] },
        { name: 'Color', values: ['Blanco', 'Negro', 'Gris'] },
      ],
      price: 15000,
      stock: 20,
    },
    {
      name: 'Pantalón Cargo Hombre',
      brand: 'Adidas',
      gender: 'Hombre',
      categoryKey: 'Pantalones-Hombre',
      options: [
        { name: 'Talle', values: ['38', '40', '42', '44'] },
        { name: 'Color', values: ['Negro', 'Beige'] },
      ],
      price: 32000,
      stock: 15,
    },
    {
      name: 'Zapatillas Running Hombre',
      brand: 'Nike',
      gender: 'Hombre',
      categoryKey: 'Zapatillas-Hombre',
      options: [
        { name: 'Talle', values: ['40', '41', '42', '43', '44'] },
        { name: 'Color', values: ['Blanco', 'Negro'] },
      ],
      price: 85000,
      stock: 10,
    },
    {
      name: 'Campera Deportiva Hombre',
      brand: 'Puma',
      gender: 'Hombre',
      categoryKey: 'Camperas-Hombre',
      options: [
        { name: 'Talle', values: ['S', 'M', 'L', 'XL'] },
        { name: 'Color', values: ['Azul', 'Negro'] },
      ],
      price: 55000,
      stock: 8,
    },
    {
      name: 'Remera Oversize Mujer',
      brand: 'Zara',
      gender: 'Mujer',
      categoryKey: 'Remeras-Mujer',
      options: [
        { name: 'Talle', values: ['XS', 'S', 'M', 'L'] },
        { name: 'Color', values: ['Rosa', 'Blanco', 'Negro'] },
      ],
      price: 18000,
      stock: 25,
    },
    {
      name: 'Vestido Casual Mujer',
      brand: 'Zara',
      gender: 'Mujer',
      categoryKey: 'Vestidos-Mujer',
      options: [
        { name: 'Talle', values: ['XS', 'S', 'M', 'L'] },
        { name: 'Color', values: ['Floral', 'Negro', 'Azul'] },
      ],
      price: 42000,
      stock: 12,
    },
    {
      name: 'Zapatillas Urbanas Mujer',
      brand: 'Adidas',
      gender: 'Mujer',
      categoryKey: 'Zapatillas-Mujer',
      options: [
        { name: 'Talle', values: ['36', '37', '38', '39', '40'] },
        { name: 'Color', values: ['Blanco', 'Rosa'] },
      ],
      price: 78000,
      stock: 10,
    },
    {
      name: 'Buzo Canguro Unisex',
      brand: 'Nike',
      gender: 'Unisex',
      categoryKey: 'Buzos-Unisex',
      options: [
        { name: 'Talle', values: ['S', 'M', 'L', 'XL', 'XXL'] },
        { name: 'Color', values: ['Gris', 'Negro', 'Azul'] },
      ],
      price: 48000,
      stock: 18,
    },
    {
      name: 'Gorra Snapback Unisex',
      brand: 'New Era',
      gender: 'Unisex',
      categoryKey: 'Gorras-Unisex',
      options: [{ name: 'Color', values: ['Negro', 'Blanco', 'Rojo', 'Azul'] }],
      price: 22000,
      stock: 30,
    },
    {
      name: 'Remera Estampada Niño',
      brand: 'Cheeky',
      gender: 'Niño',
      categoryKey: 'Remeras-Niño',
      options: [
        { name: 'Talle', values: ['2', '4', '6', '8', '10'] },
        { name: 'Color', values: ['Azul', 'Rojo', 'Verde'] },
      ],
      price: 12000,
      stock: 20,
    },
  ];

  for (const def of productDefs) {
    const existing = await prisma.product.findFirst({
      where: { name: def.name },
    });
    if (existing) continue;

    const product = await prisma.product.create({
      data: {
        id: randomUUID(),
        name: def.name,
        brand: def.brand,
        gender: def.gender,
        categoryId: subCategories[def.categoryKey],
        status: 'ACTIVE',
      },
    });

    const createdOptions: Record<
      string,
      { id: string; values: Record<string, string> }
    > = {};

    for (const opt of def.options) {
      const option = await prisma.productOption.create({
        data: {
          id: randomUUID(),
          name: opt.name,
          productId: product.id,
          values: {
            create: opt.values.map((v) => ({ id: randomUUID(), value: v })),
          },
        },
        include: { values: true },
      });
      createdOptions[opt.name] = {
        id: option.id,
        values: Object.fromEntries(option.values.map((v) => [v.value, v.id])),
      };
    }

    const combos = def.options.reduce<string[][]>((acc, opt) => {
      if (acc.length === 0) return opt.values.map((v) => [v]);
      return acc.flatMap((combo) => opt.values.map((v) => [...combo, v]));
    }, []);

    for (const combo of combos) {
      const variant = await prisma.productVariant.create({
        data: {
          id: randomUUID(),
          productId: product.id,
          price: def.price,
          stock: def.stock,
          sku: `${def.name.substring(0, 3).toUpperCase()}-${combo.join('-')}`.replace(
            /\s/g,
            '',
          ),
        },
      });

      for (let i = 0; i < def.options.length; i++) {
        const optName = def.options[i].name;
        const val = combo[i];
        await prisma.variantOptionValue.create({
          data: {
            id: randomUUID(),
            variantId: variant.id,
            optionId: createdOptions[optName].id,
            valueId: createdOptions[optName].values[val],
          },
        });
      }
    }
  }

  const clientDefs = [
    { name: 'Lucía Fernández', email: 'lucia.fernandez@gmail.com' },
    { name: 'Martín García', email: 'martin.garcia@gmail.com' },
    { name: 'Valentina López', email: 'valentina.lopez@gmail.com' },
    { name: 'Santiago Rodríguez', email: 'santiago.rodriguez@gmail.com' },
    { name: 'Camila Martínez', email: 'camila.martinez@gmail.com' },
    { name: 'Nicolás Pérez', email: 'nicolas.perez@gmail.com' },
    { name: 'Sofía González', email: 'sofia.gonzalez@gmail.com' },
    { name: 'Tomás Díaz', email: 'tomas.diaz@gmail.com' },
  ];

  const customerIds: string[] = [];

  for (const c of clientDefs) {
    const existing = await prisma.customer.findFirst({
      where: { email: c.email },
    });
    if (existing) {
      customerIds.push(existing.id);
    } else {
      const created = await prisma.customer.create({
        data: { id: randomUUID(), name: c.name, email: c.email },
      });
      customerIds.push(created.id);
    }
  }

  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
