"use client";

import { ImageFlipCard } from "@/components/motion/flip-cards";

const projects = [
  { name: "Coastal house", category: "Residence", description: "A quiet home shaped around morning light and an open horizon", image: "photo-1600210492486-724fe5c67fb0" },
  { name: "The long room", category: "Workspace", description: "A shared studio designed for deep work and generous pauses", image: "photo-1497366811353-6870744d04b2" },
  { name: "Garden edge", category: "Landscape", description: "Living spaces that open gradually into the surrounding garden", image: "photo-1600607687939-ce8a6c25118c" },
];
export function ImageFlipCardsPreview() {
  return <div className="grid w-full max-w-5xl gap-5 px-4 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">{projects.map(project => <ImageFlipCard key={project.name} label={project.name}
    front={<div className="relative h-full"><img src={`https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=900&q=85`} alt={project.name} loading="lazy" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/35 p-4 text-white backdrop-blur-xl"><p className="text-xs text-white/65">{project.category}</p><h3 className="mt-2 text-xl font-medium">{project.name}</h3></div></div>}
    back={<div className="relative flex h-full flex-col justify-end bg-muted p-6"><img src={`https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=900&q=85`} alt="" className="absolute inset-0 size-full object-cover opacity-20" /><div className="relative"><h3 className="text-2xl font-medium">{project.name}</h3><p className="mt-3 text-sm text-muted-foreground">{project.description}</p><a href="/workspace" className="mt-6 inline-block text-sm underline underline-offset-4">View project ↗</a></div></div>} />)}</div>;
}
