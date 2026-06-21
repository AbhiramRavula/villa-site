"use client";

import { useRef, useCallback, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  onClick,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      buttonRef.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = "translate(0, 0)";
    buttonRef.current.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      if (buttonRef.current) buttonRef.current.style.transition = "";
    }, 500);
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`magnetic-area ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
