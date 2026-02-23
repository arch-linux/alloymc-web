export const SITE = {
  name: "Alloy",
  tagline: "Forged with Alloy",
  domain: "alloymc.net",
  url: "https://alloymc.net",
  description:
    "A from-scratch Minecraft modding ecosystem. New mod loader, modding API, mappings pipeline, modpack format, and launcher.",
  github: "https://github.com/arch-linux/alloy",
  discord: "https://discord.gg/DhkaV5gnT9",
};

export const NAV_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Getting Started", href: "/getting-started" },
  { label: "Downloads", href: "/downloads" },
  { label: "Mods", href: "/mods" },
  { label: "Packs", href: "/packs" },
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

export const PACK_CATEGORIES = [
  { value: "adventure", label: "Adventure" },
  { value: "tech", label: "Tech" },
  { value: "magic", label: "Magic" },
  { value: "rpg", label: "RPG" },
  { value: "survival", label: "Survival" },
  { value: "hardcore", label: "Hardcore" },
  { value: "skyblock", label: "Skyblock" },
  { value: "kitchen-sink", label: "Kitchen Sink" },
  { value: "lightweight", label: "Lightweight" },
  { value: "other", label: "Other" },
] as const;
