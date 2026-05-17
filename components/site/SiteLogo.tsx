import Image from "next/image";
import Link from "next/link";

/** Intrinsic dimensions of public/logo.png after optimization */
const LOGO_WIDTH = 480;
const LOGO_HEIGHT = 331;

type SiteLogoProps = {
  href?: string;
  className?: string;
  priority?: boolean;
};

export function SiteLogo({ href = "/", className = "", priority = false }: SiteLogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt="Darse Quran Academy — Come towards Quran, come towards success"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={`h-10 w-auto sm:h-11 ${className}`.trim()}
      priority={priority}
      sizes="(max-width: 640px) 200px, 240px"
    />
  );

  if (!href) return image;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {image}
    </Link>
  );
}
