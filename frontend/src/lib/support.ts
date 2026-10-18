/** Public customer support contact (override via env if needed). */
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "janetdesina@gmail.com";

export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}`;
