/**
 * Estrellas fugaces: overlay CSS muy ligero (sin JS por frame) que cruza la
 * pantalla en diagonal. Decorativo y respeta prefers-reduced-motion (ver CSS).
 */
const STARS = [
  { top: "12%", left: "15%", delay: "0s", duration: "3.2s" },
  { top: "24%", left: "60%", delay: "2.4s", duration: "2.6s" },
  { top: "8%", left: "80%", delay: "5s", duration: "3.6s" },
  { top: "40%", left: "35%", delay: "7.5s", duration: "2.8s" },
  { top: "18%", left: "5%", delay: "10s", duration: "3.4s" },
];

export function ShootingStars() {
  return (
    <div aria-hidden="true" className="shooting-stars pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="shooting-star"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}
