"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isPending?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isPending,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex gap-3">
        <span className="shrink-0 h-10 w-10 rounded-full bg-error/10 text-error flex items-center justify-center">
          <AlertTriangle size={18} />
        </span>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          disabled={isPending}
          className="!bg-error hover:!bg-error/90"
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
