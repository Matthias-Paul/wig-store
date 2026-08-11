import { z } from "zod";

export const checkoutSchema = z.object({
  recipientName: z.string().min(1, "Name is required").max(100),
  recipientPhone: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number"),
  recipientEmail: z.string().email("Enter a valid email address"),
  shippingAddress: z.string().min(1, "Address is required"),
  shippingCity: z.string().min(1, "City is required"),
  shippingState: z.string().min(1, "State is required"),
  landmark: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
