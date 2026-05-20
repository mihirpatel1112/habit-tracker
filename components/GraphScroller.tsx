"use client";

import { useEffect, useRef, useState } from "react";

interface GraphScrollerProps {
  children: React.ReactNode;
}

export function GraphScroller({ children }: GraphScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const scroller = scrollRef.current;

    if (!scroller) {
      return;
    }

    scroller.scrollLeft = scroller.scrollWidth;

    const updateEdges = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    };

    updateEdges();
    scroller.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);

    return () => {
      scroller.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, []);

  return (
    <div className="graph-scroller-wrap mt-3">
      <div
        aria-hidden
        className={`graph-scroller-fade graph-scroller-fade-left ${canScrollLeft ? "is-visible" : ""}`}
      />
      <div
        aria-hidden
        className={`graph-scroller-fade graph-scroller-fade-right ${canScrollRight ? "is-visible" : ""}`}
      />
      <div
        className="graph-scroller flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={scrollRef}
      >
        {children}
      </div>
      <p className="graph-scroll-hint tahoe-caption mt-2">Swipe to see earlier months →</p>
    </div>
  );
}
