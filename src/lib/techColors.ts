// ======================================
// PIXIE TECH COLOR SYSTEM
// ======================================

export const techColors: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  react: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },

  nextjs: {
    bg: "bg-neutral-200",
    text: "text-neutral-800",
    border: "border-neutral-300",
  },

  typescript: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },

  javascript: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },

  nodejs: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },

  tailwind: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    border: "border-sky-200",
  },

  firebase: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },

  mongodb: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },

  ai: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },

  web3: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },

  solidity: {
    bg: "bg-slate-200",
    text: "text-slate-800",
    border: "border-slate-300",
  },

  default: {
    bg: "bg-pink-100",
    text: "text-pink-700",
    border: "border-pink-200",
  },
};

/* ======================================
   HELPER FUNCTION
====================================== */

export function getTechColor(tech?: string) {
  if (!tech) return techColors.default;

  const key = tech.toLowerCase().replace(/\s/g, "");

  return techColors[key] || techColors.default;
}