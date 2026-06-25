import { SectionHeading } from "../SectionHeading";
import { Reveal } from "../Reveal";
import { ProjectCard } from "../ProjectCard";
import { projects } from "@/config/site";

export function Projects() {
  return (
    <section id="proyectos" className="mx-auto max-w-5xl px-6 py-28">
      <SectionHeading
        eyebrow="03 · Proyectos"
        title="Mundos que he construido"
        intro="Cosas que he construido: algunas en producción, otras por pura curiosidad de fin de semana."
      />

      <Reveal stagger className="grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </Reveal>
    </section>
  );
}
