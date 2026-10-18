import Link from "next/link";
import { CallLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { BUSINESS } from "@/content/site";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header data-dark className="sticky top-0 z-30 border-b border-white/10 bg-brand-gradient">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" aria-label="RM Electronics, home" className="rounded-control">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <NavLinks
            className="flex items-center gap-1"
            linkClassName="inline-flex min-h-11 items-center rounded-control px-3.5 text-base font-medium text-lavender-200 hover:bg-white/10 hover:text-white"
            activeClassName="!text-white underline decoration-accent decoration-[3px] underline-offset-8"
          />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CallLink placement="header" asButton variant="secondary" />
          <BookRepairButton placement="header">Book Doorstep Repair</BookRepairButton>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CallLink
            placement="header_mobile"
            className="inline-flex h-12 w-12 items-center justify-center rounded-control bg-accent text-brand hover:bg-accent-hover"
          >
            <Icon name="phone" className="h-6 w-6" />
            <span className="sr-only">Call RM Electronics on {BUSINESS.phone.display}</span>
          </CallLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
