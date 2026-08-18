import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { BusinessConfigModule } from '../business-config/business-config.module';

@Module({
  imports: [BusinessConfigModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
