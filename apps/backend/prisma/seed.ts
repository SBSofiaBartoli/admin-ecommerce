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

  const parentCategories = [
    { name: 'Principal', position: 0 },
    { name: 'Hombre', position: 1 },
    { name: 'Mujer', position: 2 },
    { name: 'Niño', position: 3 },
    { name: 'Mascota', position: 4 },
    { name: 'Electrónica', position: 5 },
    { name: 'Hogar', position: 6 },
    { name: 'Jardín', position: 7 },
  ];

  for (const cat of parentCategories) {
    const existing = await (prisma.category as any).findFirst({
      where: { name: cat.name, parentId: null },
    });
    if (!existing) {
      await (prisma.category as any).create({
        data: {
          id: randomUUID(),
          name: cat.name,
          position: cat.position,
        },
      });
    }
  }
  console.log('Seed completed');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
