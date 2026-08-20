"use client";

// import { useState } from "react";
// import { Bell } from "lucide-react";
// import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
// import { useAdminNotifications } from "@/src/features/admin/hooks/useAdminNotifications";
// import { AdminNotificationItem } from "@/src/features/admin/components/AdminNotificationItem";
// import { Pagination } from "@/src/components/ui/Pagination";
// import { Skeleton } from "@/src/components/ui/Skeleton";
// import { EmptyState } from "@/src/components/ui/EmptyState";

export default function AdminNotificationsPage() {
//   const [page, setPage] = useState(1);
//   const { data, isLoading } = useAdminNotifications(page);

//   return (
//     <AdminLayout title="Notifications">
//       <p className="text-sm text-gray-500 mb-5">
//         All customer and system activity across the store
//       </p>

//       <div className="bg-white rounded-xl border border-gray-200 p-2">
//         {isLoading ? (
//           <div className="space-y-3 p-3">
//             <Skeleton className="h-14 w-full" />
//             <Skeleton className="h-14 w-full" />
//             <Skeleton className="h-14 w-full" />
//           </div>
//         ) : !data || data.notifications.length === 0 ? (
//           <EmptyState icon={<Bell size={44} />} title="No notifications yet" />
//         ) : (
//           <div className="divide-y divide-gray-100 px-2">
//             {data.notifications.map((n) => (
//               <AdminNotificationItem key={n.id} notification={n} />
//             ))}
//           </div>
//         )}
//       </div>

//       {data && data.pagination.totalPages > 1 && (
//         <div className="mt-5">
//           <Pagination
//             currentPage={data.pagination.page}
//             totalPages={data.pagination.totalPages}
//             onPageChange={setPage}
//           />
//         </div>
//       )}
//     </AdminLayout>
//   );
}
