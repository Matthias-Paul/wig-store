import { Input } from "./Input";
import { Search } from "lucide-react";
import { InputHTMLAttributes } from "react";

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2"
        size={16}
      />
      <Input
        {...props}
        type="search"
        className="w-full bg-white dark:bg-gray-500 text-black dark:text-white rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand focus:border-brand"
      />
    </div>
  );
}
