import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SaleStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Post()
  create() {
    return this.salesService.create();
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: SaleStatus,
    @Body('note') note?: string,
  ) {
    return this.salesService.updateStatus(id, status, note);
  }
}
