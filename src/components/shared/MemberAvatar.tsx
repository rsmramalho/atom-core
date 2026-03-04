// Avatar component using colored initials derived from email/name
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-red-500/20 text-red-400",
  "bg-blue-500/20 text-blue-400",
  "bg-green-500/20 text-green-400",
  "bg-purple-500/20 text-purple-400",
  "bg-amber-500/20 text-amber-400",
  "bg-pink-500/20 text-pink-400",
  "bg-cyan-500/20 text-cyan-400",
  "bg-orange-500/20 text-orange-400",
];

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(email?: string | null, fallback?: string): string {
  if (email) {
    const local = email.split("@")[0];
    // Try to get 2 chars from name parts (e.g. john.doe -> JD)
    const parts = local.split(/[._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return local.slice(0, 2).toUpperCase();
  }
  return fallback?.slice(0, 2).toUpperCase() || "??";
}

interface MemberAvatarProps {
  email?: string | null;
  fallback?: string;
  size?: "sm" | "md";
  className?: string;
}

export function MemberAvatar({ email, fallback, size = "sm", className }: MemberAvatarProps) {
  const initials = getInitials(email, fallback);
  const color = getColorFromString(email || fallback || "unknown");

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold select-none flex-shrink-0",
        size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm",
        color,
        className
      )}
    >
      {initials}
    </div>
  );
}
