import { site } from "@/config/site";

/** Marca ÓRBITA: glifo de planeta + órbita + satélite, junto al nombre. */
export function Logo({ withName = true }: { withName?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logo-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7c5cff" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="6"
          transform="rotate(-30 16 16)"
          stroke="url(#logo-grad)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle cx="16" cy="16" r="5.5" fill="url(#logo-grad)" />
        <circle cx="26.5" cy="9.5" r="2" fill="#fbbf24" />
      </svg>
      {withName && (
        <span className="font-display text-sm font-semibold tracking-tight text-star">
          {site.name}
        </span>
      )}
    </span>
  );
}
