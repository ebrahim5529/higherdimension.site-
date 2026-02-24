import { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: "none" | "sm" | "md" | "lg";
}

export function RevealOnScroll({ children, className, delay = "none" }: RevealOnScrollProps) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-on-scroll",
        isInView && "revealed",
        delay === "sm" && "delay-100",
        delay === "md" && "delay-200",
        delay === "lg" && "delay-300",
        className
      )}
    >
      {children}
    </div>
  );
}
