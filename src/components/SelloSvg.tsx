import React from "react";

interface SelloSvgProps {
  className?: string;
  mini?: boolean;
  roto?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function SelloSvg({ className = "", mini = false, roto = false, onClick, style }: SelloSvgProps) {
  const baseClass = mini
    ? "w-16 h-16 flex-shrink-0 drop-shadow-[0_3px_5px_rgba(60,20,20,0.3)] transition-transform active:scale-95 duration-200"
    : "w-[150px] h-[150px] drop-shadow-[0_6px_10px_rgba(60,20,20,0.35)] transition-transform active:scale-95 duration-200";

  const rotoClass = roto ? "animate-[romper_0.8s_ease_forwards]" : "";

  return (
    <svg
      className={`${baseClass} ${rotoClass} ${className} cursor-pointer`}
      viewBox="0 0 120 120"
      role="img"
      aria-label="Sello de lacre estoico"
      onClick={onClick}
      style={style}
    >
      <circle cx="60" cy="60" r="54" fill="#7E1B1B" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="#5C1212" stroke-width="3" />
      <circle cx="60" cy="60" r="42" fill="none" stroke="#9C3030" stroke-width="1.5" stroke-dasharray="4 3" />
      <text
        x="60"
        y="74"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="42"
        fontWeight="700"
        fill="#E8C9A0"
      >
        S
      </text>
      <path d="M32 88 q14 8 28 0 q14 -8 28 0" stroke="#9C3030" stroke-width="2" fill="none" />
      <path d="M36 32 q12 -7 24 -2 M84 32 q-12 -7 -24 -2" stroke="#9C3030" stroke-width="1.5" fill="none" />
    </svg>
  );
}
