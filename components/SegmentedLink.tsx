import Link from "next/link";

interface SegmentedLinkProps {
  href: string;
  label: string;
  active: boolean;
}

export function SegmentedLink({ href, label, active }: SegmentedLinkProps) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`segment-glass ${active ? "segment-glass-active" : ""}`}
      href={href}
      scroll={false}
    >
      {label}
    </Link>
  );
}
