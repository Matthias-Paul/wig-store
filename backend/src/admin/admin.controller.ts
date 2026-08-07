import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetRevenueChartQueryDto } from './dto/get-revenue-chart-query.dto';
import { GetTransactionsQueryDto } from './dto/get-transactions-query.dto';

@Controller('admin')
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('recent-activity')
  getRecentActivity() {
    return this.adminService.getRecentActivity();
  }

  @Get('charts/revenue')
  getRevenueChart(@Query() query: GetRevenueChartQueryDto) {
    return this.adminService.getRevenueChart(query.groupBy, query.days);
  }

  @Get('charts/orders-by-status')
  getOrdersByStatus() {
    return this.adminService.getOrdersByStatus();
  }

  @Get('transactions')
  getTransactions(@Query() query: GetTransactionsQueryDto) {
    return this.adminService.getTransactions(query);
  }
}
 