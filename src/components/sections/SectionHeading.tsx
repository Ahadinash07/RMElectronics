import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  id?: string;
  children?: ReactNode;
  as?: "h1" | "h2";
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, id, children, as: Tag = "h2", align = "left" }: Props) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-link">{eyebrow}</p>
      ) : null}
      <Tag id={id} className={Tag === "h1" ? "heading-1" : "heading-2"}>
        {title}
      </Tag>
      {children ? <div className="lead mt-3">{children}</div> : null}
    </div>
  );
}
