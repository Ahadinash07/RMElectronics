"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "onClick"> & {
  event: AnalyticsEventName;
  placement: string;
  children: ReactNode;
};

/**
 * A normal <a> that also reports a click event. Only the placement label and
 * page path are sent - never message text or any personal data.
 * The link works exactly the same if analytics is not configured.
 */
export function TrackedLink({ event, placement, children, ...anchorProps }: Props) {
  return (
    <a {...anchorProps} onClick={() => trackEvent(event, { placement })}>
      {children}
    </a>
  );
}
