import type { DocPage } from "../types";

export const mappingsDoc: DocPage = {
  slug: "mappings",
  title: "Mappings",
  description: "Understanding Alloy's automated mappings pipeline.",
  category: "guide",
  order: 1,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "Minecraft ships with **obfuscated** class, method, and field names — `abc`, `a`, `b` instead of `Level`, `getHealth`, `tickCount`. To develop mods against readable code, these names need to be mapped back to their originals.\n\nAlloy uses **Mojang's official ProGuard-format mappings**, published with every Minecraft release since 1.14.4. The entire pipeline is **fully automated** — a single Gradle command downloads Minecraft, fetches the mappings, parses them, and produces a deobfuscated JAR. Zero manual steps.\n\nUnlike other mod loaders that introduce an intermediary naming layer, Alloy maps **directly from obfuscated to deobfuscated** names. The Alloy API itself is the abstraction layer — mods never import Minecraft classes directly.",
    },
    {
      id: "namespaces",
      title: "Name Namespaces",
      content:
        "There are two namespaces in Alloy's mapping system:",
      subsections: [
        {
          id: "obfuscated",
          title: "Obfuscated (Shipped JAR)",
          content:
            "This is what Mojang distributes. Class names are compressed to short identifiers. A class like `net.minecraft.world.level.Level` becomes `abc`, its method `getTickCount` becomes `a`, and its field `tickCount` becomes `b`.\n\nThe obfuscated JAR is what runs at runtime. Alloy's loader and API layer handle translating between obfuscated internals and the clean public API your mod uses.",
        },
        {
          id: "deobfuscated",
          title: "Deobfuscated (Mojang Names)",
          content:
            "The human-readable names Mojang uses internally. These are the names you see when browsing the deobfuscated JAR — `net.minecraft.world.level.Level`, `getTickCount`, `tickCount`.\n\nThe deobfuscated JAR is generated at build time for **development reference only**. It lets the Alloy team build the API wrapper around readable code.",
        },
        {
          id: "no-intermediary",
          title: "No Intermediary Layer",
          content:
            "Other mod loaders (like Fabric) introduce a third namespace called **intermediary** — stable numeric names like `class_1234` and `method_5678` that don't change between Minecraft versions, even when Mojang renames things.\n\nAlloy doesn't need this. The Alloy API (`net.alloymc.api.*`) is the stable abstraction. Mods compile against the API, not against Minecraft classes. When Mojang renames something internally, the Alloy team updates the API implementation — mod code doesn't change.\n\nThis is simpler, faster, and eliminates an entire class of mapping-related bugs.",
        },
      ],
    },
    {
      id: "proguard-format",
      title: "ProGuard Format",
      content:
        "Mojang's mappings use the ProGuard format. The file maps **from deobfuscated to obfuscated** (the reverse of how they're used at remap time). A typical entry looks like this:",
      code: `# Class mapping: deobfuscated -> obfuscated
net.minecraft.world.level.Level -> abc:
    int tickCount -> a
    1:5:int getTickCount() -> a
    9:22:void setEntity(net.minecraft.world.entity.Entity) -> a`,
      codeLang: "text",
      subsections: [
        {
          id: "format-structure",
          title: "Structure",
          content:
            "**Class lines** start at column 0: `FullyQualifiedName -> ObfuscatedName:`\n\n**Field lines** are indented with 4 spaces: `type fieldName -> obfName`\n\n**Method lines** include optional line numbers and the full signature: `lineStart:lineEnd:returnType methodName(paramTypes) -> obfName`\n\nAlloy's parser handles all of these, converting Java source names to JVM internal format (`net.minecraft.Thing` becomes `net/minecraft/Thing`) and type names to JVM descriptors (`int` becomes `I`, `String` becomes `Ljava/lang/String;`).",
        },
        {
          id: "format-scale",
          title: "Scale",
          content:
            "For Minecraft 1.21, the mappings file is **155,000+ lines** covering roughly **12,500 classes**, **89,000 methods**, and **45,000 fields**. Every obfuscated name in the shipped JAR has a corresponding readable name.",
        },
      ],
    },
    {
      id: "pipeline",
      title: "The Pipeline",
      content:
        "The entire process runs through a single Gradle task. Here's what happens step by step:",
      subsections: [
        {
          id: "step-resolve",
          title: "1. Resolve Version",
          content:
            "Fetches Mojang's `version_manifest_v2.json` and finds the requested version (or latest release). This manifest contains download URLs for every Minecraft release ever published.",
        },
        {
          id: "step-download",
          title: "2. Download Artifacts",
          content:
            "Downloads the obfuscated `client.jar` and `client_mappings.txt` from Mojang's CDN. Both files are SHA1-verified. If they already exist in the cache and the hash matches, the download is skipped.\n\nAlso downloads the server JAR (which since 1.18 uses a nested format — the actual server JAR is extracted from `META-INF/versions/`).",
        },
        {
          id: "step-libraries",
          title: "3. Download Libraries",
          content:
            "Downloads all runtime libraries (~73 JARs) filtered by the current platform (OS and architecture). Native libraries (`.dylib`, `.dll`, `.so`) are extracted to a `natives/` directory. All downloads are cached.",
        },
        {
          id: "step-assets",
          title: "4. Download Assets",
          content:
            "Fetches the asset index and downloads all game assets (textures, sounds, language files — roughly 10,000 files) using **32 parallel connections** via virtual threads. Assets use content-addressed storage (filenames are their hashes).",
        },
        {
          id: "step-parse",
          title: "5. Parse Mappings",
          content:
            "`ProGuardParser` reads the mappings file line by line and produces structured `ClassMapping` records. Each class mapping contains its deobfuscated name, obfuscated name, and lists of field and method mappings.\n\nThe parser converts all type references to JVM descriptor format and filters out inlined method references (methods with dots in their names).",
        },
        {
          id: "step-index",
          title: "6. Build Mapping Index",
          content:
            "`MappingSet.build()` indexes all mappings into `HashMap` structures for O(1) lookup. This is a **two-phase process**:\n\n**Phase 1** — Build a bidirectional class name map (obfuscated ↔ deobfuscated).\n\n**Phase 2** — Convert all method and field descriptors from the deobfuscated namespace to the obfuscated namespace. This is critical because ASM reads obfuscated class files and provides obfuscated descriptors at remap time.\n\nFor example, a method `void setEntity(net.minecraft.world.entity.Entity)` has the deobfuscated descriptor `(Lnet/minecraft/world/entity/Entity;)V`. If `Entity` maps to `bcd`, the indexed key becomes `(Lbcd;)V` — matching what ASM will provide.",
        },
        {
          id: "step-remap",
          title: "7. Remap the JAR",
          content:
            "`JarRemapper` processes the entire obfuscated JAR using ASM's `ClassReader` → `ClassRemapper` → `ClassWriter` pipeline.\n\nFor each `.class` file, `AlloyRemapper` (which extends ASM's `Remapper`) intercepts every class reference, method call, and field access, replacing obfuscated names with their deobfuscated equivalents. The output is written to `client-remapped.jar` with correct filenames.\n\nNon-class resources (textures, JSON files, etc.) are copied unchanged.",
        },
        {
          id: "step-launch",
          title: "8. Generate Launch Scripts",
          content:
            "Finally, the pipeline generates shell scripts with the full classpath, JVM arguments, native library paths, and game arguments needed to launch Minecraft with the Alloy loader injected.",
        },
      ],
    },
    {
      id: "setup-workspace",
      title: "Running the Pipeline",
      content: "Set up a development workspace with a single command:",
      code: `# Use the latest Minecraft release
./gradlew :alloy-mappings:setupWorkspace

# Or specify a version
./gradlew :alloy-mappings:setupWorkspace -PmcVersion=1.21.4`,
      codeLang: "bash",
      subsections: [
        {
          id: "output",
          title: "What Gets Generated",
          content: "After running, your `cache/<version>/` directory contains:",
          fields: [
            { name: "client.jar", type: "~31 MB", description: "Obfuscated Minecraft client (used at runtime)" },
            { name: "client-remapped.jar", type: "~35 MB", description: "Deobfuscated Minecraft client (development reference)" },
            { name: "client_mappings.txt", type: "~5 MB", description: "Mojang's ProGuard mappings (155,000+ lines)" },
            { name: "server.jar", type: "~56 MB", description: "Bundled server JAR" },
            { name: "server-extracted.jar", type: "~20 MB", description: "Extracted inner server JAR" },
            { name: "launch.sh", type: "script", description: "Client launch script with full classpath" },
            { name: "launch-server.sh", type: "script", description: "Server launch script" },
            { name: "libraries/", type: "~73 JARs", description: "Runtime library dependencies" },
            { name: "natives/", type: "~13 files", description: "Platform-specific native libraries" },
            { name: "assets/", type: "~10,000 files", description: "Game textures, sounds, and language files" },
          ],
        },
        {
          id: "timing",
          title: "Performance",
          content: "A fresh run takes about 5 minutes (mostly downloading assets). Cached runs complete in ~30 seconds since all downloads are skipped and only the remap step runs if the JAR has changed.",
        },
      ],
    },
    {
      id: "architecture",
      title: "Internal Architecture",
      content: "The mappings module is self-contained under `alloy-mappings/` with minimal dependencies: ASM 9.7 for bytecode manipulation and Gson for JSON parsing.",
      subsections: [
        {
          id: "components",
          title: "Components",
          fields: [
            { name: "AlloyMappings", type: "Orchestrator", description: "Main pipeline entry point. Coordinates all steps from version resolution to JAR remapping." },
            { name: "MojangApi", type: "HTTP Client", description: "Fetches version manifests, metadata, JARs, mappings, and assets from Mojang's CDN." },
            { name: "ProGuardParser", type: "Parser", description: "Parses ProGuard-format mapping files into structured ClassMapping records." },
            { name: "MappingSet", type: "Index", description: "HashMap-based lookup table. Keys are obfuscated coordinates; values are deobfuscated names." },
            { name: "AlloyRemapper", type: "ASM Remapper", description: "Extends ASM's Remapper. Intercepts class, method, and field references during bytecode processing." },
            { name: "JarRemapper", type: "JAR Processor", description: "Iterates JAR entries, applies AlloyRemapper to each class file, copies resources." },
            { name: "DescriptorUtil", type: "Utility", description: "Converts between Java source types and JVM descriptors (int → I, String → Ljava/lang/String;)." },
          ],
        },
        {
          id: "data-model",
          title: "Data Model",
          content: "All mapping data is represented as Java 21 records:",
          code: `// A mapped class with its members
record ClassMapping(
    String deobfuscatedName,  // "net/minecraft/world/level/Level"
    String obfuscatedName,    // "abc"
    List<FieldMapping> fields,
    List<MethodMapping> methods
)

// A mapped method
record MethodMapping(
    String deobfuscatedName,  // "getHealth"
    String obfuscatedName,    // "a"
    String descriptor         // "(Lnet/minecraft/world/entity/Entity;)V"
)

// A mapped field
record FieldMapping(
    String deobfuscatedName,  // "health"
    String obfuscatedName,    // "a"
    String descriptor         // "D" (double)
)`,
          codeLang: "java",
        },
      ],
    },
    {
      id: "runtime",
      title: "Runtime Behavior",
      content:
        "At runtime, Minecraft runs from the **obfuscated** `client.jar` — not the remapped one. The deobfuscated JAR exists only for development reference.\n\nAlloy's loader starts via `-javaagent:alloy-loader.jar` and handles all internal name translation. The Alloy API (`net.alloymc.api.*`) wraps Minecraft internals, so mods never see obfuscated names.\n\nThis has a key legal advantage: the deobfuscated JAR is never distributed. Only the mapping process runs locally on each developer's machine, using Mojang's officially published mappings.",
    },
    {
      id: "updating",
      title: "Updating to New Versions",
      content:
        "When Mojang releases a new Minecraft version, updating is a single command:\n\n`./gradlew :alloy-mappings:setupWorkspace -PmcVersion=1.22.0`\n\nThe pipeline fetches the new JAR and mappings, parses and indexes them, and produces a fresh deobfuscated JAR. Because Mojang publishes mappings with every release, there's **no waiting** for community-maintained mappings to catch up.\n\nThis is a core advantage of using first-party mappings: updates are instant and complete.",
    },
    {
      id: "why",
      title: "Design Decisions",
      content:
        "**Why Mojang's official mappings?**\nFirst-party, legally clear, complete coverage of every class/method/field, and automatically published with every release. No dependency on community volunteers.\n\n**Why no intermediary layer?**\nFabric uses intermediary names (`class_1234`, `method_5678`) as a stable middle ground that doesn't change between versions. Alloy doesn't need this because the Alloy API is the stable abstraction. Mods compile against `net.alloymc.api.*`, not against Minecraft classes. When Mojang renames something internally, the API implementation is updated — mod code stays the same.\n\n**Why remap at build time?**\nProducing the deobfuscated JAR during workspace setup keeps the remapping cost out of game launch time. Developers can also inspect the deobfuscated code directly when building API wrappers.\n\n**Why run obfuscated at runtime?**\nThe official distribution is obfuscated. Running it directly avoids legal gray areas around redistributing deobfuscated code. The API layer handles all the translation transparently.",
    },
  ],
};
