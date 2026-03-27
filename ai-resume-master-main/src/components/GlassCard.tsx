import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function GlassCard({ children, className, hover = false, style }: GlassCardProps) {
  return (
    <div
      style={style}
      className={cn(
        "glass-card rounded-xl p-6 transition-all duration-300",
        hover && "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
