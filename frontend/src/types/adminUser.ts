import { Search } from 'lucide-react';
// src/types/adminUser.ts
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  profileImage: string | null;
  createdAt: string;
}

export interface PaginatedUsers {
  users: AdminUser[];
  pagination: {
    totalUsers: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}
