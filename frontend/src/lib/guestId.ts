
export function getGuestId(): string {
  if (typeof window === "undefined") return "";
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
}

export function clearGuestId(): void {
  localStorage.removeItem("guestId");
}
