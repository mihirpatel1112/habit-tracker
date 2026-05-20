interface SegmentedScrollProps {
  children: React.ReactNode;
  label: string;
}

export function SegmentedScroll({ children, label }: SegmentedScrollProps) {
  return (
    <div className="segment-scroll-wrap">
      <p className="sr-only">{label}</p>
      <div aria-label={label} className="segment-scroll" role="group">
        <div className="segmented-glass segment-scroll-track">{children}</div>
      </div>
    </div>
  );
}
