export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 280 280"
      className="h-auto w-full max-w-[240px]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="140" cy="140" r="110" stroke="#ddd8ce" strokeWidth="1" />
      <ellipse cx="140" cy="140" rx="110" ry="32" stroke="#ddd8ce" strokeWidth="1" strokeDasharray="4 6" />
      <path
        d="M30 140c0-61 49-110 110-110s110 49 110 110"
        stroke="#0d9488"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="95" cy="115" r="6" fill="#0d9488" />
      <circle cx="175" cy="95" r="5" fill="#ea580c" />
      <circle cx="185" cy="165" r="5" fill="#0d9488" opacity="0.6" />
      <circle cx="105" cy="170" r="4" fill="#ea580c" opacity="0.5" />
      <g transform="translate(118, 48)">
        <path d="M22 0L44 0L33 38Z" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.5" />
        <rect x="14" y="38" width="38" height="5" rx="1" fill="#0d9488" opacity="0.3" />
        <circle cx="33" cy="14" r="10" fill="#f6f4ef" stroke="#141820" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
