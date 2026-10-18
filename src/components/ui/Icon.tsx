import type { ReactNode, SVGProps } from "react";

/**
 * Small consistent SVG icon set (24x24, 1.75 stroke). No icon font, no emoji.
 * Decorative by default (aria-hidden). Pass `title` to expose a label.
 */

const STROKE_ICONS = {
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  navigation: <path d="M12 3 19 21l-7-4-7 4L12 3z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="M5 12.5 9.5 17 19 7.5" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  power: <path d="M12 3v9M7.2 6.6a7.5 7.5 0 1 0 9.6 0" />,
  tv: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  screenOff: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4M6 8l12 6" />
    </>
  ),
  lines: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 8v6M12 8v6M16 8v6M8 21h8M12 17v4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
    </>
  ),
  volume: (
    <>
      <path d="M4 10v4h4l5 4V6L8 10H4z" />
      <path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.8 16a5 5 0 0 1 6.4 0" />
      <circle cx="12" cy="19.2" r="0.9" />
    </>
  ),
  wrench: <path d="M14.7 6.3a4.5 4.5 0 0 0 5.6 5.6l-9.4 9.4a2.1 2.1 0 0 1-3-3l9.4-9.4a4.5 4.5 0 0 1-2.6-2.6zM15 9l-2 2" />,
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4h6v3H9zM9 12h6M9 16h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 21.5 20h-19L12 4z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z" />,
  home: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" />,
  store: (
    <>
      <path d="M4 10v10h16V10M3 10l2-6h14l2 6H3z" />
      <path d="M9 20v-5h6v5" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3 21l1.7-5A9 9 0 1 1 8 19.3L3 21z" />
      <path d="M9 9.5c.3 2 2.5 4.2 4.5 4.5l1.2-1.2-1.7-.9-.8.6a4 4 0 0 1-1.7-1.7l.6-.8-.9-1.7L9 9.5z" />
    </>
  ),
} satisfies Record<string, ReactNode>;

const FILL_ICONS = {
  starFilled: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z" />,
  facebook: (
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3z" />
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof STROKE_ICONS | keyof typeof FILL_ICONS;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  title?: string;
};

export function Icon({ name, title, className = "h-5 w-5", ...rest }: IconProps) {
  const isFill = name in FILL_ICONS;
  const content = isFill
    ? FILL_ICONS[name as keyof typeof FILL_ICONS]
    : STROKE_ICONS[name as keyof typeof STROKE_ICONS];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={isFill ? "currentColor" : "none"}
      stroke={isFill ? "none" : "currentColor"}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true, focusable: false })}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {content}
    </svg>
  );
}
