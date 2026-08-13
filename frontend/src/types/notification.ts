export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedOrderId?: string;
  relatedProductId?: string;
  createdAt: string;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}
