"use client";

import { clsx } from "clsx";

const TABS = [
  { key: "info", label: "Product Info" },
  { key: "variants", label: "Variants" },
] as const;

export type EditProductTab = (typeof TABS)[number]["key"];

export function EditProductTabs({
  active,
  onChange,
}: {
  active: EditProductTab;
  onChange: (tab: EditProductTab) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={clsx(
            "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
            active === tab.key
              ? "border-brand text-brand"
              : "border-transparent text-gray-500 hover:text-gray-700",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
