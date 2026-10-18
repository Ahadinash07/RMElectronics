/**
 * Two button styles plus a text link:
 *  - primary:   logo lavender fill with deep-navy text (5.6:1 contrast)
 *  - secondary: navy outline on light backgrounds. Inside a [data-dark] band it automatically
 *               becomes a white outline (see globals.css).
 * "whatsapp" is reserved for the one verified WhatsApp action.
 */

export type ButtonVariant = "primary" | "secondary" | "whatsapp";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-5 text-base font-semibold leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-brand hover:bg-accent-hover",
  secondary: "btn-secondary border-2 border-brand bg-white text-brand hover:bg-surface",
  whatsapp: "bg-whatsapp text-[#06260f] hover:brightness-95",
};

const sizes: Record<ButtonSize, string> = {
  md: "py-3",
  lg: "py-3.5 sm:px-7",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}
