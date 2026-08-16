"use client";

import { useSession } from "@/src/features/auth/hooks/useSession";
import { Avatar } from "@/src/components/ui/Avatar";
import { AdminMobileNav } from "./AdminMobileNav";

export function AdminTopbar({ title }: { title: string }) {
  const { user } = useSession();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <AdminMobileNav />
        <h1 className="font-heading font-semibold text-lg text-gray-900">{title}</h1>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900 leading-none">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
          </div>
          <Avatar src={user.profileImage} name={user.name} size="sm" />
          {/* <button
            onClick={() => logout.mutate()}
            aria-label="Log out"
            className="text-gray-400 hover:text-error transition-colors p-1.5"
          >
            <LogOut size={18} />
          </button> */}
        </div>
      )}
    </header>
  );
}
