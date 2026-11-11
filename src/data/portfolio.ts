import portrait from "@/assets/portrait.jpg";
import monolithExterior from "@/assets/monolith-exterior.jpg";
import monolithInterior from "@/assets/monolith-interior.jpg";
import monolithPlan from "@/assets/monolith-plan.jpg";
import monolithElevation from "@/assets/monolith-elevation.jpg";
import diagramAxo from "@/assets/diagram-axo.jpg";
import terraceExterior from "@/assets/terrace-exterior.jpg";
import terraceInterior from "@/assets/terrace-interior.jpg";
import terraceSection from "@/assets/terrace-section.jpg";
import terraceAerial from "@/assets/terrace-aerial.jpg";
import sketchCliff from "@/assets/sketch-cliff.jpg";
import studyModel from "@/assets/study-model.jpg";
import latticeExterior from "@/assets/lattice-exterior.jpg";
import latticeFacade from "@/assets/lattice-facade.jpg";
import latticeLobby from "@/assets/lattice-lobby.jpg";
import latticePlan from "@/assets/lattice-plan.jpg";

import tMonolithExterior from "@/assets/thumbs/monolith-exterior.jpg";
import tMonolithInterior from "@/assets/thumbs/monolith-interior.jpg";
import tMonolithPlan from "@/assets/thumbs/monolith-plan.jpg";
import tDiagramAxo from "@/assets/thumbs/diagram-axo.jpg";
import tTerraceInterior from "@/assets/thumbs/terrace-interior.jpg";
import tTerraceSection from "@/assets/thumbs/terrace-section.jpg";
import tSketchCliff from "@/assets/thumbs/sketch-cliff.jpg";
import tStudyModel from "@/assets/thumbs/study-model.jpg";
import tLatticeExterior from "@/assets/thumbs/lattice-exterior.jpg";
import tLatticeLobby from "@/assets/thumbs/lattice-lobby.jpg";

export const profile = {
  name: "Elena Roux",
  studio: "Roux Atelier",
  role: "Architect & Computational Designer",
  location: "Lisbon, Portugal",
  email: "hello@rouxatelier.studio",
  phone: "+351 21 000 0000",
  availability: "Open to commissions, competitions and collaborations from Q1 2027.",
  portrait,
  tagline: "Architecture shaped by light, logic and landscape.",
  bio: [
    "I design buildings that feel inevitable — rooted in their site, honest in their structure and generous with light. For twelve years I have moved between the drawing board and the algorithm, using computation not to decorate form but to find it.",
    "My practice, Roux Atelier, works across cultural, residential and high-rise typologies. Every project begins with a slow reading of the landscape and ends with a precise, buildable system — from a single concrete pavilion in the desert to a 60-storey lattice tower.",
  ],
  philosophy:
    "Light is the first material, structure is the second. I believe a building should reveal how it stands, respond to the climate it lives in, and leave the landscape richer than it found it. Parametric tools let me test hundreds of options quickly, but the final decision is always about how a space feels to the person inside it.",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "GitHub", href: "https://github.com" },
    { label: "Instagram", href: "https://www.instagram.com" },
    { label: "Behance", href: "https://www.behance.net" },
  ],
} as const;

export const stats = [
  { value: "12+", label: "Years in practice" },
  { value: "38", label: "Built & competition works" },
  { value: "9", label: "International awards" },
];

export const education = [
  {
    period: "2014 — 2016",
    degree: "Master of Architecture (M.Arch)",
    institution: "ETH Zürich",
    note: "Graduated with distinction · Thesis: Adaptive Lattice Structures",
  },
  {
    period: "2010 — 2013",
    degree: "B.Sc. Architecture, Urbanism & Building Sciences",
    institution: "TU Delft",
    note: "Cum laude · Exchange semester at Tokyo University",
  },
  {
    period: "2018",
    degree: "Computational Design Certificate",
    institution: "Architectural Association, London",
    note: "Visiting School — Emergent Technologies",
  },
  {
    period: "Honours",
    degree: "RIBA President's Medal (Commendation) · WAF Shortlist 2024",
    institution: "Awards & recognition",
    note: "Young Architect of the Year — shortlisted 2022",
  },
];

export const skillGroups = [
  {
    name: "Design & Modelling",
    skills: [
      { name: "Rhino 3D", level: 95 },
      { name: "Revit / BIM", level: 88 },
      { name: "AutoCAD", level: 90 },
      { name: "SketchUp", level: 80 },
    ],
  },
  {
    name: "Computational",
    skills: [
      { name: "Grasshopper", level: 94 },
      { name: "Parametric Design", level: 96 },
      { name: "Python", level: 78 },
      { name: "Three.js / WebGL", level: 72 },
    ],
  },
  {
    name: "Visualisation",
    skills: [
      { name: "Blender", level: 86 },
      { name: "V-Ray / Enscape", level: 90 },
      { name: "Unreal Engine", level: 70 },
      { name: "Adobe Suite", level: 92 },
    ],
  },
  {
    name: "Practice",
    skills: [
      { name: "Concept & Masterplanning", level: 92 },
      { name: "UI / UX for Spatial Tools", level: 74 },
      { name: "Environmental Analysis", level: 82 },
      { name: "Client Presentation", level: 95 },
    ],
  },
];

export const marqueeSkills = [
  "Rhino", "Grasshopper", "Revit", "AutoCAD", "Blender", "Three.js", "React Three Fiber",
  "Unreal Engine", "V-Ray", "Enscape", "Karamba3D", "Ladybug", "Python", "Figma",
  "Photoshop", "InDesign", "Illustrator", "SketchUp", "Parametric Design", "BIM",
  "UI/UX", "Daylight Simulation", "Digital Fabrication", "Physical Modelling",
];

export type ProjectImage = {
  src: string;
  width: number;
  height: number;
  caption: string;
  kind: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  location: string;
  year: string;
  typology: string;
  area: string;
  status: string;
  summary: string;
  narrative: string[];
  cover: ProjectImage;
  images: ProjectImage[];
  keywords: string[];
};

const img = (src: string, width: number, height: number, caption: string, kind: string): ProjectImage => ({
  src, width, height, caption, kind,
});

export const projects: Project[] = [
  {
    slug: "monolith-pavilion",
    title: "Monolith Pavilion",
    subtitle: "A cultural pavilion carved from desert light",
    client: "Atacama Cultural Foundation",
    location: "San Pedro de Atacama, Chile",
    year: "2024",
    typology: "Cultural · Exhibition Pavilion",
    area: "1,850 m²",
    status: "Completed",
    summary:
      "A 90-metre board-formed concrete bar that hovers over the desert floor, framing the Andes through a single slot of amber light.",
    narrative: [
      "The pavilion is conceived as one gesture: a long, heavy line drawn across a weightless landscape. Its board-formed concrete was cast with timber from local cooperatives, so the walls carry the grain of the region.",
      "Inside, a sequence of compressed galleries opens into a seventeen-metre atrium lit by a single oculus. The sun's path was tuned parametrically so the light pool crosses the floor like a slow clock through the day.",
      "Thermal mass, deep reveals and a buried cooling labyrinth keep the interior stable without mechanical air conditioning — a building that works with the desert, not against it.",
    ],
    cover: img(monolithExterior, 1536, 1024, "West elevation at dusk", "Photograph"),
    images: [
      img(monolithExterior, 1536, 1024, "West elevation at dusk", "Photograph"),
      img(monolithInterior, 1024, 1280, "The oculus atrium at midday", "Photograph"),
      img(monolithPlan, 1280, 1024, "Ground floor plan, 1:200", "Floor plan"),
      img(monolithElevation, 1536, 896, "Front elevation, 1:100", "Elevation"),
      img(diagramAxo, 1024, 1280, "Exploded tectonic axonometric", "Diagram"),
    ],
    keywords: ["monolith", "pavilion", "chile", "atacama", "desert", "concrete", "cultural"],
  },
  {
    slug: "cascade-house",
    title: "Cascade House",
    subtitle: "A residence that steps down a forested slope",
    client: "Private client",
    location: "Sintra, Portugal",
    year: "2023",
    typology: "Residential · Single-family",
    area: "420 m²",
    status: "Completed",
    summary:
      "Three timber terraces follow the contour of a pine-forest hillside, each with its own green roof and uninterrupted view of the valley.",
    narrative: [
      "Rather than flattening the site, the house is split into three volumes that cascade down the hill, keeping every mature pine on the plot. Each terrace becomes the garden of the level below.",
      "Charred-timber cladding and sedum roofs let the house disappear into the forest from above, while full-height glazing turns the misty valley into the main room of the house.",
      "Early sketches were tested against a terrain model in Grasshopper to balance excavation, views and winter sun — the final section moves less than 300 m³ of earth.",
    ],
    cover: img(terraceExterior, 1536, 1024, "The house at blue hour", "Photograph"),
    images: [
      img(terraceExterior, 1536, 1024, "The house at blue hour", "Photograph"),
      img(terraceInterior, 1280, 1024, "Double-height living room", "Photograph"),
      img(terraceAerial, 1280, 1024, "Aerial view of the green roofs", "Photograph"),
      img(terraceSection, 1536, 896, "Longitudinal section through the slope", "Section"),
      img(sketchCliff, 1280, 1024, "Early concept sketch", "Sketch"),
      img(studyModel, 1280, 1024, "Massing study model, 1:100", "Model"),
    ],
    keywords: ["cascade", "house", "residence", "sintra", "portugal", "timber", "hillside", "home", "residential"],
  },
  {
    slug: "helix-lattice-tower",
    title: "Helix Lattice Tower",
    subtitle: "A twisting diagrid tower for a tropical city",
    client: "Meridian Developments",
    location: "Singapore",
    year: "2025",
    typology: "Mixed-use · High-rise",
    area: "96,000 m²",
    status: "Competition winner · In design",
    summary:
      "Sixty storeys of rotating floor plates wrapped in a structural lattice that shades, stiffens and plants the tower in one system.",
    narrative: [
      "Each floor rotates 1.5° from the one below, so the tower turns a quarter-turn toward the prevailing breeze as it rises. The twist reduces wind loads by 24% and opens sky gardens at every eighth floor.",
      "The diagrid is generated from structural optimisation: members thicken where forces gather and dissolve where views matter, producing a facade that is both skeleton and sunscreen.",
      "At street level, the lattice flows down into a ribbed timber canopy, creating a shaded civic lobby that is open to the public around the clock.",
    ],
    cover: img(latticeExterior, 1024, 1408, "The tower at night", "Render"),
    images: [
      img(latticeExterior, 1024, 1408, "The tower at night", "Render"),
      img(latticeFacade, 1024, 1024, "Diagrid facade detail", "Render"),
      img(latticeLobby, 1536, 1024, "Public lobby and ribbed canopy", "Render"),
      img(latticePlan, 1024, 1024, "Typical floor plan & rotation sequence", "Floor plan"),
    ],
    keywords: ["helix", "lattice", "tower", "skyscraper", "singapore", "high-rise", "diagrid", "parametric"],
  },
];

export type ExhibitItem = {
  thumb: string;
  full: ProjectImage;
  title: string;
  project: string;
};

export const exhibition: ExhibitItem[] = [
  { thumb: tMonolithExterior, full: projects[0].images[0], title: "Monolith at dusk", project: "Monolith Pavilion" },
  { thumb: tSketchCliff, full: projects[1].images[4], title: "Cliff concept sketch", project: "Cascade House" },
  { thumb: tLatticeExterior, full: projects[2].images[0], title: "Helix at night", project: "Helix Lattice Tower" },
  { thumb: tDiagramAxo, full: projects[0].images[4], title: "Tectonic axonometric", project: "Monolith Pavilion" },
  { thumb: tTerraceInterior, full: projects[1].images[1], title: "Living room, Sintra", project: "Cascade House" },
  { thumb: tStudyModel, full: projects[1].images[5], title: "Massing study model", project: "Cascade House" },
  { thumb: tMonolithInterior, full: projects[0].images[1], title: "The oculus", project: "Monolith Pavilion" },
  { thumb: tTerraceSection, full: projects[1].images[3], title: "Section through the slope", project: "Cascade House" },
  { thumb: tLatticeLobby, full: projects[2].images[2], title: "Public lobby", project: "Helix Lattice Tower" },
  { thumb: tMonolithPlan, full: projects[0].images[2], title: "Pavilion floor plan", project: "Monolith Pavilion" },
];

export const sceneColors = {
  background: "#0B0F19",
  slate: "#1f2937",
  gold: "#F59E0B",
  goldSoft: "#fbbf24",
  white: "#f4f6fa",
};
