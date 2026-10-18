"use client";

import { useState } from "react";
import { DirectionsLink } from "@/components/analytics/ContactLinks";
import { buttonClasses } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { BUSINESS } from "@/content/site";

/**
 * Click-to-load Google Map built from the written address (no coordinates guessed, no API key).
 * Nothing from Google loads until the visitor asks for it, which keeps the page fast and private.
 */
export function MapEmbed() {
  const [show, setShow] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(`${BUSINESS.name}, ${BUSINESS.address.full}`)}&output=embed`;

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      {show ? (
        <iframe
          title={`Map showing ${BUSINESS.name}, ${BUSINESS.address.area}, Hyderabad`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[22rem] w-full border-0 sm:h-[26rem]"
        />
      ) : (
        <div className="flex h-[16rem] flex-col items-center justify-center gap-4 p-6 text-center">
          <Icon name="mapPin" className="h-10 w-10 text-brand" />
          <p className="max-w-sm text-ink-2">Show the map here. This loads content from Google Maps.</p>
          <button type="button" onClick={() => setShow(true)} className={buttonClasses("secondary")}>
            Show map
          </button>
        </div>
      )}
      <div className="border-t border-line bg-white p-3">
        <DirectionsLink placement="map" className="text-link inline-flex min-h-11 items-center gap-2">
          <Icon name="navigation" className="h-4 w-4" />
          Open directions in Google Maps
        </DirectionsLink>
      </div>
    </div>
  );
}
