import { clsx } from "clsx";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ src, name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-20 w-20 text-lg",
  };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={clsx("rounded-full object-cover", sizeClasses[size])}
      />
    );
  }

  return (
    <div
      className={clsx(
        "rounded-full bg-brand-tint text-brand flex items-center justify-center font-semibold",
        sizeClasses[size],
      )}
    >
      {initials}
    </div>
  );
}
