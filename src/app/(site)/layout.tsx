import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BUSINESS, DOORSTEP } from "@/content/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="bg-accent px-4 py-1.5 text-center text-sm font-semibold text-brand">
        Doorstep TV repair across Hyderabad &middot; Visiting charges from {DOORSTEP.visitingCharge} &middot;{" "}
        <a href={BUSINESS.phone.href} className="underline underline-offset-2">
          Call {BUSINESS.phone.display}
        </a>
      </div>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
