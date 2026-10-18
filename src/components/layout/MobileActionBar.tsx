import { CallLink, WhatsAppLink } from "@/components/analytics/ContactLinks";
import { BookRepairButton } from "@/components/forms/BookRepairButton";
import { Icon } from "@/components/ui/Icon";
import { BUSINESS } from "@/content/site";

/**
 * Fixed action bar for phones and tablets. The page reserves space for it (body padding in
 * globals.css) so it never covers footer content, and it respects the iPhone safe-area inset.
 */
export function MobileActionBar() {
  const cols = BUSINESS.whatsappVerified ? "grid-cols-3" : "grid-cols-2";
  return (
    <div
      data-dark
      role="region"
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-navy pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <div className={`mx-auto grid max-w-xl ${cols} gap-2 p-2.5`}>
        <CallLink placement="sticky_bar" asButton variant="secondary" className="px-2">
          <Icon name="phone" />
          <span>Call</span>
        </CallLink>
        <WhatsAppLink placement="sticky_bar" asButton className="px-2">
          <Icon name="whatsapp" />
          <span>WhatsApp</span>
        </WhatsAppLink>
        <BookRepairButton placement="sticky_bar" className="px-2">
          Book Doorstep
        </BookRepairButton>
      </div>
    </div>
  );
}
