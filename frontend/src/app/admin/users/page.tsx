"use client";

import { useState } from "react";
import { Users, Mail } from "lucide-react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { useAdminUsers } from "@/src/features/admin/hooks/useAdminUsers";
import { Avatar } from "@/src/components/ui/Avatar";
import { Badge } from "@/src/components/ui/Badge";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/src/components/ui/Table";
import { Pagination } from "@/src/components/ui/Pagination";
import { Select } from "@/src/components/ui/Select";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SearchInput } from "@/src/components/ui/SearchInput";

const ROLE_OPTIONS = [
  { label: "All Roles", value: "" },
  { label: "Customer", value: "customer" },
  { label: "Admin", value: "admin" },
];

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdminUsers({
    page,
    role: role || undefined,
    search: search || undefined,
  });
    function resetPage() {
      setPage(1);
    }


  return (
    <AdminLayout title="Users">
        <p className="text-sm text-gray-500">
          {data &&
            `${data.pagination.totalUsers} user${data.pagination.totalUsers !== 1 ? "s" : ""}`}
        </p>

      <div className="flex flex-col sm:flex-row gap-3 my-5">

         <div className="flex-1">
                  <SearchInput
                    placeholder="Search user..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                  />
                </div>
        <div className="w-full sm:w-48">
          <Select
            options={ROLE_OPTIONS}
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          />
        </div>
        </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : !data || data.users.length === 0 ? (
        <EmptyState
          icon={<Users size={44} />}
          title={role ? "No matching users" : "No users yet"}
          description={
            role
              ? "Try a different role filter."
              : "Customers will appear here once they sign up."
          }
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Joined</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.profileImage}
                        name={user.name}
                        size="sm"
                      />
                      <span className="font-medium text-gray-900 whitespace-nowrap">
                        {user.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Mail size={13} />
                      <span className="whitespace-nowrap">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "gold" : "brand"}>
                      {user.role === "admin" ? "Administrator" : "Customer"}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-5">
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </AdminLayout>
  );
}
