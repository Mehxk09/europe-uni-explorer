import { countryFlagUrl } from "@/lib/utils-display";

const SIZES = {
  sm: "h-4 w-6",
  md: "h-7 w-10",
  lg: "h-10 w-14",
  xl: "h-14 w-20",
} as const;

/** Real flag image — emoji flags show as "DE" on Windows. */
export function CountryFlag({
  code,
  size = "md",
  className = "",
}: {
  code: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  if (code.length !== 2) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={countryFlagUrl(code)}
      alt=""
      width={size === "xl" ? 80 : size === "lg" ? 56 : size === "md" ? 40 : 24}
      height={size === "xl" ? 56 : size === "lg" ? 40 : size === "md" ? 28 : 16}
      className={`${SIZES[size]} shrink-0 rounded-md object-cover shadow-sm ring-1 ring-black/10 ${className}`}
      loading="lazy"
    />
  );
}
