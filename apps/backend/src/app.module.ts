import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [PrismaModule, CategoriesModule],
})
export class AppModule {}
