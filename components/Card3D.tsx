//site-paqsec/components/Card3D.tsx

"use client";
import React, { JSX, useRef } from "react";

export default function Card3D({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  const el = useRef<HTMLDivElement | null>(null);

  function handleLeave() {
    if (!el.current) return;
    el.current.style.transition = "transform 450ms cubic-bezier(.2,.8,.2,1)";
    el.current.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg)";
    setTimeout(() => {
      if (el.current) el.current.style.transition = "";
    }, 500);
  }

  return (
    <div
      ref={el}
      onPointerLeave={handleLeave}
      className={`rounded-2xl bg-black/60 border border-white/8 shadow-2xl transform-gpu will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
      role="group"
    >
      <div className="p-6">{children}</div>
    </div>
  );
}
