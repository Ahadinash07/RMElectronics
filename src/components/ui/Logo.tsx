import Image from "next/image";

/**
 * Header lockup built from the real logo: the logo's own monitor mark plus live text in the logo's
 * white + lavender colours (the full logo image is too small to read at header size).
 * Designed for dark navy backgrounds.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image src="/images/logo.png" alt="" width={222} height={174} className="h-14 w-auto sm:h-14" />
    </span>
  );
}

/** The complete logo image (as supplied by the business) for larger placements. */
export function FullLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/rm-electronics-logo.webp"
      alt="RM Electronics, TV service and repair"
      width={468}
      height={240}
      className={className}
    />
  );
}
