"use client";

interface SectionLabelProps {
  children: string;
  className?: string;
  withLine?: boolean;
}

export default function SectionLabel({
  children,
  className = "",
  withLine = true,
}: SectionLabelProps) {
  return (
    <div className={`text-section-label ${className}`}>
      {withLine && (
        <span className="inline-block w-6 h-[1px] bg-[var(--champagne)] mr-3 align-middle" />
      )}
      {children}
    </div>
  );
}
