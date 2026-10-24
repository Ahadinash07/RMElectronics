"use client";

import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { INSTAGRAM_PROFILE_URL } from "@/content/site";

export function InstagramEmbed({ height = 700 }: { height?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!show) return;
    const existing = document.getElementById("instagram-embed-script");
    if (existing) return;
    const script = document.createElement("script");
    script.id = "instagram-embed-script";
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, [show]);

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      {show ? (
        <blockquote
          className="instagram-media w-full"
          data-instgrm-permalink={INSTAGRAM_PROFILE_URL}
          data-instgrm-version="14"
          style={{
            background: "#FFF",
            border: 0,
            borderRadius: "3px",
            boxShadow: "none",
            margin: "1px",
            maxWidth: "540px",
            minWidth: "326px",
            padding: 0,
            width: "calc(100% - 2px)",
          }}
        />
      ) : (
        <div className="flex h-[16rem] flex-col items-center justify-center gap-4 p-6 text-center">
          <Icon name="instagram" className="h-10 w-10 text-brand" />
          <p className="max-w-sm text-ink-2">Show Instagram profile feed. This loads content from Instagram.</p>
          <button type="button" onClick={() => setShow(true)} className={buttonClasses("secondary")}>
            Show Instagram
          </button>
        </div>
      )}
    </div>
  );
}
