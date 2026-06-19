"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { stats } from "@/config/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const nums = gsap.utils.toArray<HTMLElement>("[data-count]");

      nums.forEach((el) => {
        const end = Number(el.dataset.count);
        if (reduce) {
          el.textContent = String(end);
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mx-auto max-w-5xl px-6 py-16">
      <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label} className="surface rounded-2xl p-6 text-center">
            <p className="text-4xl font-bold text-gradient sm:text-5xl">
              <span data-count={s.value}>0</span>
              {s.suffix}
            </p>
            <p className="mt-2 text-sm text-star-dim">{s.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
