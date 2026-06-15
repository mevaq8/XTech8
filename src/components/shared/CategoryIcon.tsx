import { Tag } from "lucide-react";
import { cn } from "@/utils/cn";

interface CategoryIconProps {
  iconUrl?: string | null;
  name?: string;
  className?: string;
  fallbackClassName?: string;
}

export default function CategoryIcon({
  iconUrl,
  name,
  className,
  fallbackClassName,
}: CategoryIconProps) {
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={name || "Category icon"}
        className={cn("object-contain shrink-0", className)}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <Tag
      className={cn("shrink-0 text-slate-400", fallbackClassName, className)}
    />
  );
}
