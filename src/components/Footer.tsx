import { Logo } from "./Logo";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 pb-12 pt-8">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
        <Logo />
        <div className="text-center sm:text-right">
          <p className="text-sm text-star-dim">
            Hecho con código, café y curiosidad desde <span className="text-star">Bilbao</span> 🌧️
          </p>
          <p className="mt-1 text-xs text-star-dim/70">
            © {new Date().getFullYear()} {site.name} · Next.js · Three.js · GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}
