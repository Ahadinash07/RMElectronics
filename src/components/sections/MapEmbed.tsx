"use client";

import { DirectionsLink } from "@/components/analytics/ContactLinks";
import { Icon } from "@/components/ui/Icon";
import { BUSINESS, MAPS_EMBED_URL } from "@/content/site";

/**
 * Google Maps embed using the exact provided embed code for the business location.
 */
export function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <iframe
        title={`Map showing ${BUSINESS.name}, ${BUSINESS.address.area}, Hyderabad`}
        src={MAPS_EMBED_URL}
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="block h-[22rem] w-full border-0 sm:h-[26rem]"
      />
      <div className="border-t border-line bg-white p-3">
        <DirectionsLink placement="map" className="text-link inline-flex min-h-11 items-center gap-2">
          <Icon name="navigation" className="h-4 w-4" />
          Open directions in Google Maps
        </DirectionsLink>
      </div>
    </div>
  );
}
