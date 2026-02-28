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
  await (prisma.user as any).upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'admin@admin.com',
      password: hashedPassword,
    },
  });
  console.log('Seed completed: admin@admin.com / admin123');
}

main()
  .catch(console.error)
  .finally(() => (prisma as any).$disconnect());
