export const CLUSTER_COLORS = [
  "#2563EB", // blue
  "#16A34A", // green
  "#F59E0B", // amber
  "#7C3AED", // purple
  "#EC4899", // pink
  "#EF4444", // red
  "#0891B2", // cyan
  "#EA580C", // orange
  "#4F46E5", // indigo
  "#059669", // emerald
  "#D946EF", // fuchsia
  "#DC2626", // rose
];

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/solemate";

export const INJURY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "plantar_fasciitis", label: "Plantar Fasciitis" },
  { value: "shin_splints", label: "Shin Splints" },
  { value: "knee", label: "Knee Pain" },
  { value: "ankle", label: "Ankle Issues" },
  { value: "achilles", label: "Achilles Tendinitis" },
];

export const NAV_STEPS = [
  { path: "/", label: "Home", shortLabel: "H" },
  { path: "/input", label: "Profile", shortLabel: "P" },
  { path: "/explore", label: "Explore", shortLabel: "E" },
  { path: "/recommendations", label: "Results", shortLabel: "R" },
  { path: "/rotation", label: "Rotation", shortLabel: "Ro" },
  { path: "/compare", label: "Compare", shortLabel: "C" },
];
