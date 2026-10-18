import type { ReactNode } from "react";
import { BUSINESS, MAPS_DIRECTIONS_URL, buildWhatsAppUrl } from "@/content/site";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { TrackedLink } from "./TrackedLink";

type CommonProps = {
  placement: string;
  className?: string;
  children?: ReactNode;
};

type ButtonProps = CommonProps & { variant?: ButtonVariant; size?: ButtonSize; asButton?: boolean };

function classFor({ asButton, variant = "secondary", size = "md", className = "" }: ButtonProps) {
  return asButton ? buttonClasses(variant, size, className) : className;
}

/** tel: link. Shows the main business number by default. */
export function CallLink(props: ButtonProps) {
  const { placement, children } = props;
  return (
    <TrackedLink
      href={BUSINESS.phone.href}
      event="phone_click"
      placement={placement}
      className={classFor(props)}
      aria-label={children ? undefined : `Call RM Electronics on ${BUSINESS.phone.display}`}
    >
      {children ?? (
        <>
          <Icon name="phone" />
          <span>Call</span>
        </>
      )}
    </TrackedLink>
  );
}

/** Renders nothing unless the owner has confirmed the number is on WhatsApp. */
export function WhatsAppLink(props: ButtonProps & { message?: string }) {
  if (!BUSINESS.whatsappVerified) return null;
  const { placement, children, message } = props;
  return (
    <TrackedLink
      href={buildWhatsAppUrl(message)}
      event="whatsapp_click"
      placement={placement}
      target="_blank"
      rel="noopener noreferrer"
      className={classFor({ variant: "whatsapp", ...props })}
    >
      {children ?? (
        <>
          <Icon name="whatsapp" />
          <span>WhatsApp</span>
        </>
      )}
    </TrackedLink>
  );
}

export function DirectionsLink(props: ButtonProps) {
  const { placement, children } = props;
  return (
    <TrackedLink
      href={MAPS_DIRECTIONS_URL}
      event="directions_click"
      placement={placement}
      target="_blank"
      rel="noopener noreferrer"
      className={classFor(props)}
    >
      {children ?? (
        <>
          <Icon name="navigation" />
          <span>Get directions</span>
        </>
      )}
    </TrackedLink>
  );
}
