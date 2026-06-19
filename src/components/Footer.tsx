import { Logo } from "./Logo";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 pb-12 pt-8">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
        <Logo />
        <p className="text-xs text-star-dim">
          © {new Date().getFullYear()} {site.name}. Hecho con Next.js, Three.js y GSAP.
        </p>
      </div>
    </footer>
  );
}
