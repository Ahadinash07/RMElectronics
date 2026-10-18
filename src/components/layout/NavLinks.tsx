"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/content/site";

type Props = {
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
  onNavigate?: () => void;
};

export function NavLinks({ className = "", linkClassName = "", activeClassName = "", onNavigate }: Props) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {NAV_LINKS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`${linkClassName} ${active ? activeClassName : ""}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
