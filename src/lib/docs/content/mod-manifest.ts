import type { DocPage } from "../types";

export const modManifestDoc: DocPage = {
  slug: "mod-manifest",
  title: "Mod Manifest",
  description: "The alloy.mod.json file — required fields, dependencies, and environment targeting.",
  category: "config",
  order: 1,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "Every Alloy mod must include an `alloy.mod.json` file in `src/main/resources/`. This manifest tells the mod loader everything it needs to know: the mod's identity, its entry point class, what it depends on, and which environment it targets.\n\nThe file is standard JSON. All string values are case-sensitive.",
    },
    {
      id: "fields",
      title: "Fields",
      content: "The complete list of manifest fields:",
      fields: [
        {
          name: "id",
          type: "string",
          description: "Unique identifier for the mod. Lowercase alphanumeric and hyphens only. Used in dependency declarations and internal lookups.",
          required: true,
        },
        {
          name: "name",
          type: "string",
          description: "Human-readable display name. Shown in mod lists and logs.",
          required: true,
        },
        {
          name: "version",
          type: "string",
          description: "Semantic version string (e.g., \"1.0.0\", \"2.1.0-beta.3\"). Follow SemVer conventions.",
          required: true,
        },
        {
          name: "description",
          type: "string",
          description: "Short description of what the mod does.",
        },
        {
          name: "authors",
          type: "string[]",
          description: "Array of author names.",
        },
        {
          name: "license",
          type: "string",
          description: "SPDX license identifier (e.g., \"MIT\", \"Apache-2.0\", \"GPL-3.0-only\").",
        },
        {
          name: "entrypoint",
          type: "string",
          description: "Fully-qualified class name of the ModInitializer implementation. This class must have a no-argument constructor.",
          required: true,
        },
        {
          name: "dependencies",
          type: "object",
          description: "Map of mod ID to version range. The loader ensures dependencies are present and compatible before loading your mod.",
        },
        {
          name: "environment",
          type: "string",
          description: "Where this mod should load: \"client\", \"server\", or \"both\".",
          defaultValue: "both",
        },
      ],
    },
    {
      id: "full-example",
      title: "Full Example",
      code: `{
  "id": "economy-plus",
  "name": "Economy Plus",
  "version": "2.3.1",
  "description": "A full-featured economy system with shops, trading, and banking",
  "authors": ["DevName", "ContributorName"],
  "license": "MIT",
  "entrypoint": "com.example.economyplus.EconomyPlus",
  "dependencies": {
    "alloy": ">=0.1.0",
    "minecraft": "1.21.x"
  },
  "environment": "server"
}`,
      codeLang: "json",
    },
    {
      id: "dependencies",
      title: "Dependencies",
      content:
        "The `dependencies` object maps mod IDs to version constraints. The mod loader resolves all dependencies before initialization and will refuse to load a mod if its dependencies are missing or incompatible.\n\nTwo special dependency IDs are available:\n\n`alloy` — The Alloy mod loader version.\n`minecraft` — The Minecraft game version.",
      subsections: [
        {
          id: "version-syntax",
          title: "Version Syntax",
          content: "Supported version constraint formats:",
          fields: [
            { name: "\"*\"", type: "any", description: "Matches any version. Use for optional soft dependencies." },
            { name: "\">=1.0.0\"", type: "minimum", description: "At least this version. Most common for the alloy dependency." },
            { name: "\"1.2.x\"", type: "wildcard", description: "Any version matching 1.2.* (patch-level flexibility)." },
            { name: "\"~1.2.0\"", type: "compatible", description: "Compatible with 1.2.0 — allows patch updates (1.2.1, 1.2.99) but not minor bumps." },
          ],
        },
      ],
    },
    {
      id: "environment",
      title: "Environment",
      content: "Controls where the mod is loaded. Choose based on what your mod does:",
      enumValues: [
        {
          name: "both",
          description: "Load on both client and server. Default. Use when your mod has both client and server components.",
        },
        {
          name: "server",
          description: "Only load on dedicated servers. Use for pure server-side mods (commands, game mechanics, economy systems).",
        },
        {
          name: "client",
          description: "Only load on the client. Use for client-only mods (HUDs, shaders, keybinds).",
        },
      ],
    },
    {
      id: "id-conventions",
      title: "ID Conventions",
      content:
        "Mod IDs should be:\n\n**Lowercase** — `my-mod`, not `My-Mod` or `MY_MOD`.\n\n**Alphanumeric + hyphens** — Letters, numbers, and hyphens only. No underscores, dots, or spaces.\n\n**Short and unique** — Keep it concise. Check the Alloy Mod Explorer to avoid collisions.\n\n**Prefixed for organizations** — If you're part of a team, consider a prefix: `acme-economy`, `acme-chat`.\n\nThe mod ID is used in permission nodes (convention: `modid.permission`), configuration paths, and dependency declarations.",
    },
    {
      id: "minimal-example",
      title: "Minimal Manifest",
      content: "The absolute minimum `alloy.mod.json` with only required fields:",
      code: `{
  "id": "my-mod",
  "name": "My Mod",
  "version": "1.0.0",
  "entrypoint": "com.example.mymod.MyMod"
}`,
      codeLang: "json",
    },
  ],
};
