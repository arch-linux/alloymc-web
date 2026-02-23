import type { DocPage } from "../types";

export const permissionsDoc: DocPage = {
  slug: "permissions",
  title: "Permissions",
  description: "Register permission nodes, check access, and implement custom permission providers.",
  category: "systems",
  order: 1,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "The permission system controls what players can do. Every command and feature can be gated behind a permission node (e.g., `mymod.admin`). By default, permissions are checked against operator (OP) status, but mods can provide custom backends (LuckPerms-style groups, database-backed roles, etc.).\n\nPermissions are registered through `AlloyAPI.permissionRegistry()` and checked via the `PermissionHolder` interface that both `Player` and `CommandSender` implement.",
    },
    {
      id: "permission-holder",
      title: "PermissionHolder",
      content: "The interface implemented by `Player` and `CommandSender` for checking permissions.",
      methods: [
        {
          signature: "holder.hasPermission(String permission): boolean",
          description: "Checks if this holder has the given permission. Delegates to the active PermissionProvider.",
          params: [{ name: "permission", type: "String", description: "The permission node (e.g., \"mymod.admin\")" }],
          returns: { type: "boolean", description: "True if the holder has the permission" },
        },
        {
          signature: "holder.isOp(): boolean",
          description: "Whether this holder is a server operator.",
          returns: { type: "boolean", description: "True if OP" },
        },
      ],
    },
    {
      id: "permission-registry",
      title: "PermissionRegistry",
      content: "The central registry for permission nodes. Register your permissions here so other mods and permission managers can discover them.",
      methods: [
        {
          signature: "registry.register(String node, String description, PermissionDefault defaultValue): void",
          description: "Registers a permission node with a description and default access level.",
          params: [
            { name: "node", type: "String", description: "The permission node (e.g., \"mymod.teleport\")" },
            { name: "description", type: "String", description: "Human-readable description" },
            { name: "defaultValue", type: "PermissionDefault", description: "Who gets this by default" },
          ],
        },
        {
          signature: "registry.register(String node, String description): void",
          description: "Registers a permission node with OP-only default.",
          params: [
            { name: "node", type: "String", description: "The permission node" },
            { name: "description", type: "String", description: "Human-readable description" },
          ],
        },
        {
          signature: "registry.get(String node): PermissionInfo",
          description: "Looks up a registered permission.",
          params: [{ name: "node", type: "String", description: "The permission node" }],
          returns: { type: "PermissionInfo", description: "Permission info, or null" },
        },
        {
          signature: "registry.allNodes(): Set<String>",
          description: "Returns all registered permission nodes.",
          returns: { type: "Set<String>", description: "All nodes" },
        },
        {
          signature: "registry.setProvider(PermissionProvider provider): void",
          description: "Sets a custom permission provider. Only one provider is active at a time.",
          params: [{ name: "provider", type: "PermissionProvider", description: "The provider implementation" }],
        },
      ],
    },
    {
      id: "permission-default",
      title: "PermissionDefault",
      content: "Controls who has a permission by default, before any permission manager overrides it.",
      enumValues: [
        { name: "TRUE", description: "Everyone has this permission by default" },
        { name: "FALSE", description: "Nobody has this permission by default" },
        { name: "OP", description: "Only operators have this permission by default (most common)" },
      ],
    },
    {
      id: "permission-provider",
      title: "PermissionProvider",
      content: "Implement this interface to provide a custom permission backend (database, file-based groups, etc.). Set it via `registry.setProvider()`.",
      methods: [
        {
          signature: "provider.hasPermission(UUID playerId, String playerName, String permission): boolean",
          description: "Check if a player has a permission. This is called every time `hasPermission()` is invoked on a player.",
          params: [
            { name: "playerId", type: "UUID", description: "The player's UUID" },
            { name: "playerName", type: "String", description: "The player's username" },
            { name: "permission", type: "String", description: "The permission node" },
          ],
          returns: { type: "boolean", description: "True if permitted" },
        },
        {
          signature: "provider.isOp(UUID playerId): boolean",
          description: "Check if a player is an operator.",
          params: [{ name: "playerId", type: "UUID", description: "The player's UUID" }],
          returns: { type: "boolean", description: "True if OP" },
        },
        {
          signature: "provider.onEnable(): void",
          description: "Called when the provider is activated. Load data here.",
        },
        {
          signature: "provider.onDisable(): void",
          description: "Called when the provider is deactivated. Save data here.",
        },
      ],
    },
    {
      id: "example",
      title: "Example",
      content: "Register permissions in your `onInitialize()` and check them wherever needed:",
      code: `@Override
public void onInitialize() {
    PermissionRegistry perms = AlloyAPI.permissionRegistry();

    // Register with different defaults
    perms.register("mymod.use", "Basic mod access", PermissionDefault.TRUE);
    perms.register("mymod.teleport", "Use teleport commands", PermissionDefault.OP);
    perms.register("mymod.admin", "Full admin access", PermissionDefault.FALSE);
}

// In an event handler or command:
if (player.hasPermission("mymod.teleport")) {
    player.teleport(destination);
} else {
    player.sendMessage("You don't have permission to teleport.");
}`,
      codeLang: "java",
    },
  ],
};
