import Link from "next/link";

interface SiteLogoProps {
  logo?: string;
  logoText?: string;
  className?: string;
}

export function SiteLogo({ logo, logoText = "کیش لند وب", className }: SiteLogoProps) {
  const brandLabel = logoText || "کیش لند وب";

  return (
    <Link
      href="/"
      className={className ?? "inline-flex items-center transition-opacity hover:opacity-70"}
      aria-label={`${brandLabel} — klandweb`}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={`${brandLabel} — klandweb`} className="h-9 w-auto max-w-[140px] object-contain" />
      ) : (
        <span className="gradient-text text-lg font-bold tracking-tight">{brandLabel}</span>
      )}
    </Link>
  );
}
