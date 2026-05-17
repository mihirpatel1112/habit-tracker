"use client";

import { useEffect, useRef } from "react";

interface GraphScrollerProps {
  children: React.ReactNode;
}

export function GraphScroller({ children }: GraphScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollLeft = scroller.scrollWidth;
  }, []);

  return (
    <div className="mt-4 flex gap-6 overflow-x-auto pb-3" ref={scrollRef}>
      {children}
    </div>
  );
}
