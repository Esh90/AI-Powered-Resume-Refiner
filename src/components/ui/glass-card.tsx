import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export const GlassCard = ({ children, className, hover = false, style }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6",
        "shadow-card transition-all duration-300",
        hover && "hover:bg-white/10 hover:shadow-premium hover:scale-105",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};