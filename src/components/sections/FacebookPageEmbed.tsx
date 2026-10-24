"use client";

import { useState } from "react";
import { buttonClasses } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { FACEBOOK_PAGE_EMBED_URL } from "@/content/site";

export function FacebookPageEmbed({ height = 600 }: { height?: number }) {
  const [show, setShow] = useState(false);

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      {show ? (
        <iframe
          title="RM Electronics Facebook Page"
          src={FACEBOOK_PAGE_EMBED_URL.replace("height=600", `height=${height}`)}
          width="500"
          height={height}
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          loading="lazy"
          className="block h-[32rem] w-full"
        />
      ) : (
        <div className="flex h-[16rem] flex-col items-center justify-center gap-4 p-6 text-center">
          <Icon name="facebook" className="h-10 w-10 text-brand" />
          <p className="max-w-sm text-ink-2">Show Facebook page posts. This loads content from Facebook.</p>
          <button type="button" onClick={() => setShow(true)} className={buttonClasses("secondary")}>
            Show Facebook page
          </button>
        </div>
      )}
    </div>
  );
}
