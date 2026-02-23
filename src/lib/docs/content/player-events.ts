import type { DocPage } from "../types";

export const playerEventsDoc: DocPage = {
  slug: "player-events",
  title: "Player Events",
  description: "Events fired when players join, chat, move, interact, die, and more.",
  category: "api",
  order: 4,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "Player events fire in response to player actions. All player events extend `PlayerEvent` and provide a `player()` method. These are among the most commonly used events in mod development.",
    },
    {
      id: "player-join",
      title: "PlayerJoinEvent",
      content: "Fired when a player joins the server. Not cancellable.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player who joined.",
          returns: { type: "Player", description: "The joining player" },
        },
        {
          signature: "event.joinMessage(): String",
          description: "The join message that will be broadcast.",
          returns: { type: "String", description: "The join message" },
        },
        {
          signature: "event.setJoinMessage(String message): void",
          description: "Change the join message. Set to null to suppress it.",
          params: [{ name: "message", type: "String", description: "New message, or null" }],
        },
      ],
      subsections: [
        {
          id: "player-join-example",
          title: "Example",
          code: `@EventHandler
public void onJoin(PlayerJoinEvent event) {
    Player player = event.player();
    if (!player.hasPlayedBefore()) {
        event.setJoinMessage(player.displayName() + " joined for the first time!");
    }
}`,
          codeLang: "java",
        },
      ],
    },
    {
      id: "player-quit",
      title: "PlayerQuitEvent",
      content: "Fired when a player disconnects.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player who left.",
          returns: { type: "Player", description: "The leaving player" },
        },
        {
          signature: "event.quitMessage(): String",
          description: "The quit message that will be broadcast.",
          returns: { type: "String", description: "The quit message" },
        },
        {
          signature: "event.setQuitMessage(String message): void",
          description: "Change the quit message. Set to null to suppress it.",
          params: [{ name: "message", type: "String", description: "New message, or null" }],
        },
      ],
    },
    {
      id: "player-chat",
      title: "PlayerChatEvent",
      content: "Fired when a player sends a chat message. Cancellable. **This is an async event** — do not modify game state directly from the handler.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player who sent the message.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.message(): String",
          description: "The chat message.",
          returns: { type: "String", description: "The message" },
        },
        {
          signature: "event.setMessage(String message): void",
          description: "Modify the chat message.",
          params: [{ name: "message", type: "String", description: "New message" }],
        },
      ],
    },
    {
      id: "player-command",
      title: "PlayerCommandEvent",
      content: "Fired when a player attempts to run a command. Cancellable. Cancel to silently block the command.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player running the command.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.command(): String",
          description: "The full command string (including the leading slash).",
          returns: { type: "String", description: "The command" },
        },
        {
          signature: "event.setCommand(String command): void",
          description: "Change the command that will be executed.",
          params: [{ name: "command", type: "String", description: "New command" }],
        },
      ],
    },
    {
      id: "player-move",
      title: "PlayerMoveEvent",
      content: "Fired when a player moves. Cancellable — cancelling teleports the player back to the `from` location.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player who moved.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.from(): Location",
          description: "The player's previous location.",
          returns: { type: "Location", description: "Origin location" },
        },
        {
          signature: "event.to(): Location",
          description: "The player's new location.",
          returns: { type: "Location", description: "Destination location" },
        },
        {
          signature: "event.setTo(Location location): void",
          description: "Override the destination. The player will move here instead.",
          params: [{ name: "location", type: "Location", description: "New destination" }],
        },
      ],
    },
    {
      id: "player-teleport",
      title: "PlayerTeleportEvent",
      content: "Extends `PlayerMoveEvent`. Fired specifically for teleportation events. Cancellable.",
      methods: [
        {
          signature: "event.cause(): TeleportCause",
          description: "What triggered the teleport.",
          returns: { type: "TeleportCause", description: "The teleport cause" },
        },
      ],
      subsections: [
        {
          id: "teleport-cause",
          title: "TeleportCause",
          enumValues: [
            { name: "ENDER_PEARL", description: "Threw an ender pearl" },
            { name: "NETHER_PORTAL", description: "Entered a nether portal" },
            { name: "END_PORTAL", description: "Entered an end portal" },
            { name: "CHORUS_FRUIT", description: "Ate chorus fruit" },
            { name: "COMMAND", description: "Teleported by a command" },
            { name: "PLUGIN", description: "Teleported by a mod" },
            { name: "UNKNOWN", description: "Unknown cause" },
          ],
        },
      ],
    },
    {
      id: "player-interact",
      title: "PlayerInteractEvent",
      content: "Fired when a player interacts (clicks) in the world. Cancellable.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.action(): Action",
          description: "The type of interaction.",
          returns: { type: "Action", description: "The action type" },
        },
        {
          signature: "event.clickedBlock(): Block",
          description: "The block that was clicked, if any.",
          returns: { type: "Block", description: "The block, or null for air clicks" },
        },
        {
          signature: "event.blockFace(): BlockFace",
          description: "The face of the block that was clicked.",
          returns: { type: "BlockFace", description: "The block face" },
        },
        {
          signature: "event.item(): ItemStack",
          description: "The item in the player's hand.",
          returns: { type: "ItemStack", description: "The held item" },
        },
        {
          signature: "event.hasBlock(): boolean",
          description: "Whether a block was targeted.",
          returns: { type: "boolean", description: "True if a block was clicked" },
        },
      ],
      subsections: [
        {
          id: "action",
          title: "Action",
          enumValues: [
            { name: "LEFT_CLICK_BLOCK", description: "Left-clicked a block" },
            { name: "RIGHT_CLICK_BLOCK", description: "Right-clicked a block" },
            { name: "LEFT_CLICK_AIR", description: "Left-clicked in the air" },
            { name: "RIGHT_CLICK_AIR", description: "Right-clicked in the air" },
            { name: "PHYSICAL", description: "Physical interaction (pressure plate, tripwire)" },
          ],
        },
      ],
    },
    {
      id: "player-interact-entity",
      title: "PlayerInteractEntityEvent",
      content: "Fired when a player right-clicks on an entity. Cancellable.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.rightClicked(): Entity",
          description: "The entity that was right-clicked.",
          returns: { type: "Entity", description: "The clicked entity" },
        },
      ],
    },
    {
      id: "player-death",
      title: "PlayerDeathEvent",
      content: "Fired when a player dies. Not cancellable.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player who died.",
          returns: { type: "Player", description: "The dead player" },
        },
        {
          signature: "event.drops(): List<ItemStack>",
          description: "Items that will be dropped. Mutable.",
          returns: { type: "List<ItemStack>", description: "Mutable list of drops" },
        },
        {
          signature: "event.deathMessage(): String",
          description: "The death message to broadcast.",
          returns: { type: "String", description: "The death message" },
        },
        {
          signature: "event.setDeathMessage(String message): void",
          description: "Change the death message. Set to null to suppress it.",
          params: [{ name: "message", type: "String", description: "New message" }],
        },
        {
          signature: "event.keepInventory(): boolean",
          description: "Whether the player keeps their inventory on death.",
          returns: { type: "boolean", description: "True if keeping inventory" },
        },
        {
          signature: "event.setKeepInventory(boolean keep): void",
          description: "Set whether the player keeps their inventory.",
          params: [{ name: "keep", type: "boolean", description: "True to keep" }],
        },
        {
          signature: "event.keepLevel(): boolean",
          description: "Whether the player keeps their experience level.",
          returns: { type: "boolean", description: "True if keeping level" },
        },
        {
          signature: "event.setKeepLevel(boolean keep): void",
          description: "Set whether the player keeps their level.",
          params: [{ name: "keep", type: "boolean", description: "True to keep" }],
        },
      ],
    },
    {
      id: "player-respawn",
      title: "PlayerRespawnEvent",
      content: "Fired when a player respawns after dying.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The respawning player.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.respawnLocation(): Location",
          description: "Where the player will respawn.",
          returns: { type: "Location", description: "The respawn location" },
        },
        {
          signature: "event.setRespawnLocation(Location location): void",
          description: "Override the respawn location.",
          params: [{ name: "location", type: "Location", description: "New location" }],
        },
      ],
    },
    {
      id: "player-drop-item",
      title: "PlayerDropItemEvent",
      content: "Fired when a player drops an item. Cancellable.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.itemDrop(): Entity",
          description: "The dropped item entity.",
          returns: { type: "Entity", description: "The item entity" },
        },
      ],
    },
    {
      id: "player-item-held",
      title: "PlayerItemHeldEvent",
      content: "Fired when a player changes their selected hotbar slot. Cancellable.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.previousSlot(): int",
          description: "The previously selected slot index (0-8).",
          returns: { type: "int", description: "Previous slot" },
        },
        {
          signature: "event.newSlot(): int",
          description: "The newly selected slot index (0-8).",
          returns: { type: "int", description: "New slot" },
        },
      ],
    },
    {
      id: "player-bucket",
      title: "PlayerBucketEvent",
      content: "Fired when a player fills or empties a bucket. Cancellable.",
      methods: [
        {
          signature: "event.player(): Player",
          description: "The player.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.block(): Block",
          description: "The block being filled from or emptied into.",
          returns: { type: "Block", description: "The target block" },
        },
        {
          signature: "event.bucket(): Material",
          description: "The bucket material (WATER_BUCKET, LAVA_BUCKET, or BUCKET).",
          returns: { type: "Material", description: "The bucket type" },
        },
        {
          signature: "event.isFilling(): boolean",
          description: "Whether the bucket is being filled (picking up liquid).",
          returns: { type: "boolean", description: "True if filling" },
        },
        {
          signature: "event.isEmptying(): boolean",
          description: "Whether the bucket is being emptied (placing liquid).",
          returns: { type: "boolean", description: "True if emptying" },
        },
      ],
    },
  ],
};
