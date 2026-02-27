import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule, SalesModule],
})
export class AppModule {}
