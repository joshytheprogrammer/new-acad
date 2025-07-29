"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  className?: string;
}

export function NumberTicker({ value, className }: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev < value) {
          return Math.min(prev + Math.ceil(value / 50), value);
        }
        return value;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className={cn("transition-all duration-300", className)}>
      {displayValue}
    </span>
  );
} 