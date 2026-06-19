"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Magnetic } from "./Magnetic";
import { navLinks } from "@/config/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        aria-label="Principal"
        className={`flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${
          scrolled ? "surface shadow-lg shadow-black/30" : "border-transparent bg-transparent"
        }`}
      >
        <a href="#inicio" className="rounded-lg" aria-label="Ir al inicio">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-star-dim transition-colors hover:text-star"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <Magnetic className="hidden md:inline-block">
          <a
            href="#contacto"
            className="inline-block rounded-full bg-gradient-to-r from-nebula to-plasma px-4 py-2 text-sm font-semibold text-void"
          >
            Hablemos
          </a>
        </Magnetic>

        {/* Botón móvil */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="rounded-lg p-2 text-star md:hidden"
        >
          <span className="block h-0.5 w-5 bg-current transition-transform" style={{ transform: open ? "translateY(3px) rotate(45deg)" : undefined }} />
          <span className={`mt-1 block h-0.5 w-5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className="mt-1 block h-0.5 w-5 bg-current transition-transform" style={{ transform: open ? "translateY(-3px) rotate(-45deg)" : undefined }} />
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {open && (
        <div
          id="mobile-menu"
          className="surface absolute top-20 mx-4 w-[calc(100%-2rem)] max-w-5xl rounded-2xl p-3 md:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm text-star-dim transition-colors hover:bg-white/5 hover:text-star"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
