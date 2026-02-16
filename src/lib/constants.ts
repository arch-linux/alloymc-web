export const SITE = {
  name: "Alloy",
  tagline: "Forged with Alloy",
  domain: "alloymc.net",
  url: "https://alloymc.net",
  description:
    "A from-scratch Minecraft modding ecosystem. New mod loader, modding API, mappings pipeline, modpack format, and launcher.",
  github: "https://github.com/arch-linux/alloy",
  discord: "https://discord.gg/alloymc",
};

export const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Getting Started", href: "/getting-started" },
  { label: "Downloads", href: "/downloads" },
  { label: "Mods", href: "/mods" },
  { label: "Docs", href: "/docs" },
  { label: "Community", href: "/community" },
] as const;

export const MOD_CATEGORIES = [
  { value: "adventure", label: "Adventure" },
  { value: "decoration", label: "Decoration" },
  { value: "economy", label: "Economy" },
  { value: "food", label: "Food" },
  { value: "library", label: "Library" },
  { value: "magic", label: "Magic" },
  { value: "management", label: "Management" },
  { value: "mobs", label: "Mobs" },
  { value: "optimization", label: "Optimization" },
  { value: "storage", label: "Storage" },
  { value: "technology", label: "Technology" },
  { value: "transportation", label: "Transportation" },
  { value: "utility", label: "Utility" },
  { value: "worldgen", label: "World Gen" },
] as const;
