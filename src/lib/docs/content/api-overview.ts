import type { DocPage } from "../types";

export const apiOverviewDoc: DocPage = {
  slug: "api-overview",
  title: "API Overview",
  description: "Architecture and core concepts of the Alloy modding API.",
  category: "api",
  order: 0,
  sections: [
    {
      id: "architecture",
      title: "Architecture",
      content:
        "The Alloy API is organized around a single static entry point — `AlloyAPI` — which provides access to every subsystem: the server, event bus, command registry, permission registry, and scheduler.\n\nAll public API types live under the `net.alloymc.api` package. The mod loader API (entry points and manifest) lives under `net.alloymc.loader.api`.",
    },
    {
      id: "alloy-api",
      title: "AlloyAPI",
      content:
        "The `AlloyAPI` class is the root of the entire modding API. It's a final class with a private constructor — all methods are static. Call these from anywhere in your mod after initialization.",
      methods: [
        {
          signature: "AlloyAPI.server(): Server",
          description: "Returns the Server instance. Access online players, worlds, the logger, and server-wide operations.",
          returns: { type: "Server", description: "The server instance" },
        },
        {
          signature: "AlloyAPI.eventBus(): EventBus",
          description: "Returns the event bus for registering listeners and firing events.",
          returns: { type: "EventBus", description: "The global event bus" },
        },
        {
          signature: "AlloyAPI.commandRegistry(): CommandRegistry",
          description: "Returns the command registry for registering and looking up commands.",
          returns: { type: "CommandRegistry", description: "The command registry" },
        },
        {
          signature: "AlloyAPI.permissionRegistry(): PermissionRegistry",
          description: "Returns the permission registry for registering permission nodes and setting providers.",
          returns: { type: "PermissionRegistry", description: "The permission registry" },
        },
        {
          signature: "AlloyAPI.scheduler(): Scheduler",
          description: "Returns the scheduler for running synchronous and asynchronous tasks.",
          returns: { type: "Scheduler", description: "The task scheduler" },
        },
        {
          signature: "AlloyAPI.environment(): LaunchEnvironment",
          description: "Returns whether the game is running as CLIENT or SERVER.",
          returns: { type: "LaunchEnvironment", description: "CLIENT or SERVER" },
        },
        {
          signature: "AlloyAPI.itemFactory(): ItemFactory",
          description: "Returns the item factory for creating ItemStacks from scratch.",
          returns: { type: "ItemFactory", description: "The item factory" },
        },
        {
          signature: "AlloyAPI.inventoryFactory(): InventoryFactory",
          description: "Returns the inventory factory for creating CustomInventory instances.",
          returns: { type: "InventoryFactory", description: "The inventory factory" },
        },
        {
          signature: "AlloyAPI.menuFactory(): MenuFactory",
          description: "Returns the menu factory for building MenuLayout instances with typed slots and synced properties.",
          returns: { type: "MenuFactory", description: "The menu factory" },
        },
      ],
    },
    {
      id: "server",
      title: "Server",
      content: "The `Server` interface provides access to players, worlds, and server-wide operations.",
      methods: [
        {
          signature: "server.onlinePlayers(): Collection<Player>",
          description: "Returns all currently online players.",
          returns: { type: "Collection<Player>", description: "All online players" },
        },
        {
          signature: "server.player(UUID id): Optional<Player>",
          description: "Looks up a player by their unique ID.",
          params: [{ name: "id", type: "UUID", description: "The player's UUID" }],
          returns: { type: "Optional<Player>", description: "The player if online, empty otherwise" },
        },
        {
          signature: "server.player(String name): Optional<Player>",
          description: "Looks up a player by their username.",
          params: [{ name: "name", type: "String", description: "The player's username" }],
          returns: { type: "Optional<Player>", description: "The player if online, empty otherwise" },
        },
        {
          signature: "server.worlds(): Collection<World>",
          description: "Returns all loaded worlds.",
          returns: { type: "Collection<World>", description: "All worlds" },
        },
        {
          signature: "server.world(String name): Optional<World>",
          description: "Looks up a world by name.",
          params: [{ name: "name", type: "String", description: "The world name" }],
          returns: { type: "Optional<World>", description: "The world if loaded, empty otherwise" },
        },
        {
          signature: "server.dataDirectory(): Path",
          description: "Returns the server's data directory path.",
          returns: { type: "Path", description: "Path to the server data directory" },
        },
        {
          signature: "server.logger(): Logger",
          description: "Returns the server logger for writing log messages.",
          returns: { type: "Logger", description: "The server logger" },
        },
        {
          signature: "server.currentTick(): long",
          description: "Returns the current server tick count since startup.",
          returns: { type: "long", description: "Current tick number" },
        },
        {
          signature: "server.broadcast(String message): void",
          description: "Sends a message to all online players.",
          params: [{ name: "message", type: "String", description: "The message to broadcast" }],
        },
      ],
    },
    {
      id: "launch-environment",
      title: "LaunchEnvironment",
      content: "Indicates whether the game is running as a client or dedicated server. Use this to conditionally load client-only or server-only features.",
      enumValues: [
        { name: "CLIENT", description: "Running as a game client (singleplayer or connecting to a server)" },
        { name: "SERVER", description: "Running as a dedicated server" },
      ],
    },
  ],
};
