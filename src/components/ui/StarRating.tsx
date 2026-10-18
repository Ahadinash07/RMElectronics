import { Icon } from "./Icon";

/** Read-only star rating with a text alternative. Only used for real, customer-given ratings. */
export function StarRating({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`Rated ${rating} out of 5`} className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name={n <= rating ? "starFilled" : "star"} className={`h-5 w-5 ${n <= rating ? "text-info" : "text-[#9ca3af]"}`} />
      ))}
    </span>
  );
}
