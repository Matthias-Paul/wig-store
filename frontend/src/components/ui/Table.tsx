import { ReactNode } from "react";
import { clsx } from "clsx";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

export function TableRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr className={clsx("hover:bg-gray-700 cursor-pointer transition-colors", className)}>
      {children}
    </tr>
  );
}

export function TableHeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={clsx("px-4 py-3 text-gray-700", className)}>{children}</td>
  );
}
