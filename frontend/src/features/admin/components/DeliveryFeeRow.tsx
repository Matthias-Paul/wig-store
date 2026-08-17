"use client";

import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { useUpdateDeliveryFee } from "../hooks/useUpdateDeliveryFee";
import { TableRow, TableCell } from "@/src/components/ui/Table";
import type { DeliveryFee } from "@/src/types/deliveryFee";

export function DeliveryFeeRow({ deliveryFee }: { deliveryFee: DeliveryFee }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(deliveryFee.fee.toString());
  const updateFee = useUpdateDeliveryFee();

  function startEdit() {
    setValue(deliveryFee.fee.toString());
    setIsEditing(true);
  }

  function handleSave() {
    const parsed = Number(value);
    if (isNaN(parsed) || parsed < 0) return;
    updateFee.mutate(
      { id: deliveryFee.id, fee: parsed },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function toggleActive() {
    updateFee.mutate({
      id: deliveryFee.id,
      fee: Number(value),
      isActive: !deliveryFee.isActive,
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium text-gray-900">
        {deliveryFee.state}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-sm">₦</span>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditing(false);
              }}
              autoFocus
              className="w-24 border border-brand rounded-md px-2 py-1 text-sm outline-none"
            />
            <button
              onClick={handleSave}
              disabled={updateFee.isPending}
              className="p-1.5 text-success cursor-pointer hover:bg-success/10 rounded-md"
              aria-label="Save"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 text-gray-400 cursor-pointer hover:bg-gray-100 rounded-md"
              aria-label="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 text-sm text-gray-900 hover:text-brand group"
          >
            ₦{deliveryFee.fee.toLocaleString()}
            <Pencil size={12} className="cursor-pointer" />
          </button>
        )}
      </TableCell>
      <TableCell>
        <button
          onClick={toggleActive}
          disabled={updateFee.isPending}
          className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
            deliveryFee.isActive ? "bg-success" : "bg-gray-200"
          }`}
          aria-label={deliveryFee.isActive ? "Deactivate" : "Activate"}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              deliveryFee.isActive ? "translate-x-4.5" : "translate-x-1"
            }`}
          />
        </button>
      </TableCell>
      <TableCell className="text-xs text-gray-400 whitespace-nowrap">
        {new Date(deliveryFee.updatedAt).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
        })}
      </TableCell>
    </TableRow>
  );
}
