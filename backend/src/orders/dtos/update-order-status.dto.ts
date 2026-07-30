import { IsIn } from 'class-validator';
import { OrderStatus } from '../../common/enums/order-status.enum';

const ADMIN_ALLOWED_STATUSES = [
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
] as const;

export class UpdateOrderStatusDto {
  @IsIn(ADMIN_ALLOWED_STATUSES, {
    message: `status must be one of: ${ADMIN_ALLOWED_STATUSES.join(', ')}`,
  })
  status: OrderStatus;
}