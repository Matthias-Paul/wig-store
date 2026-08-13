import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string) =>
    sonnerToast.success(message, {
      style: { background: "#16A34A", color: "#fff", border: "none" },
    }),
  error: (message: string) =>
    sonnerToast.error(message, {
      style: { background: "#DC2626", color: "#fff", border: "none" },
    }),
  info: (message: string) =>
    sonnerToast(message, {
      style: { background: "#7E297E", color: "#fff", border: "none" },
    }),
};
