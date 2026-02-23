import type { DocPage } from "../types";

export const entitiesDoc: DocPage = {
  slug: "entities",
  title: "Entities",
  description: "The Entity hierarchy — Player, LivingEntity, Projectile, and entity types.",
  category: "api",
  order: 5,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "Entities are anything in the world that isn't a block — players, mobs, dropped items, projectiles, vehicles, and more. The Alloy entity API uses a clean interface hierarchy:\n\n`Entity` → `LivingEntity` → `Player`\n\n`Entity` → `Projectile`\n\n`LivingEntity` → `TameableEntity`\n\nAll entities have a UUID, a type, a location, and support persistent metadata.",
    },
    {
      id: "entity",
      title: "Entity",
      content: "The base interface for all entities in the game.",
      methods: [
        {
          signature: "entity.uniqueId(): UUID",
          description: "The entity's globally unique identifier. Persists across server restarts for players.",
          returns: { type: "UUID", description: "The entity UUID" },
        },
        {
          signature: "entity.type(): EntityType",
          description: "The type of this entity (ZOMBIE, PLAYER, ARROW, etc.).",
          returns: { type: "EntityType", description: "The entity type enum" },
        },
        {
          signature: "entity.location(): Location",
          description: "The entity's current location in the world.",
          returns: { type: "Location", description: "Current location" },
        },
        {
          signature: "entity.world(): World",
          description: "The world this entity is in.",
          returns: { type: "World", description: "The entity's world" },
        },
        {
          signature: "entity.isValid(): boolean",
          description: "Whether this entity reference is still valid (not removed/dead).",
          returns: { type: "boolean", description: "True if still valid" },
        },
        {
          signature: "entity.remove(): void",
          description: "Removes this entity from the world.",
        },
        {
          signature: "entity.teleport(Location destination): void",
          description: "Teleports the entity to the given location. Works across worlds.",
          params: [{ name: "destination", type: "Location", description: "Target location" }],
        },
        {
          signature: "entity.name(): String",
          description: "The entity's internal name (e.g., \"Zombie\", the player's username).",
          returns: { type: "String", description: "The name" },
        },
        {
          signature: "entity.displayName(): String",
          description: "The entity's display name. May differ from the internal name.",
          returns: { type: "String", description: "The display name" },
        },
      ],
      subsections: [
        {
          id: "entity-metadata",
          title: "Persistent Metadata",
          content: "Every entity supports key-value metadata that persists across server restarts. Use this to attach custom data to entities without external storage.",
          methods: [
            {
              signature: "entity.hasMetadata(String key): boolean",
              description: "Checks if a metadata key exists on this entity.",
              params: [{ name: "key", type: "String", description: "The metadata key" }],
              returns: { type: "boolean", description: "True if the key exists" },
            },
            {
              signature: "entity.setMetadata(String key, Object value): void",
              description: "Sets a metadata value on this entity.",
              params: [
                { name: "key", type: "String", description: "The metadata key" },
                { name: "value", type: "Object", description: "The value to store" },
              ],
            },
            {
              signature: "entity.getMetadata(String key): Object",
              description: "Gets a metadata value from this entity.",
              params: [{ name: "key", type: "String", description: "The metadata key" }],
              returns: { type: "Object", description: "The stored value, or null" },
            },
            {
              signature: "entity.removeMetadata(String key): void",
              description: "Removes a metadata key from this entity.",
              params: [{ name: "key", type: "String", description: "The metadata key" }],
            },
          ],
        },
      ],
    },
    {
      id: "living-entity",
      title: "LivingEntity",
      content: "Extends `Entity`. Represents any entity with health — mobs, animals, players.",
      methods: [
        {
          signature: "entity.health(): double",
          description: "The entity's current health.",
          returns: { type: "double", description: "Current health" },
        },
        {
          signature: "entity.maxHealth(): double",
          description: "The entity's maximum health.",
          returns: { type: "double", description: "Max health" },
        },
        {
          signature: "entity.setHealth(double health): void",
          description: "Sets the entity's health. Clamped between 0 and max health.",
          params: [{ name: "health", type: "double", description: "New health value" }],
        },
        {
          signature: "entity.damage(double amount): void",
          description: "Deals damage to the entity. Fires an EntityDamageEvent.",
          params: [{ name: "amount", type: "double", description: "Damage to deal" }],
        },
        {
          signature: "entity.damage(double amount, Entity source): void",
          description: "Deals damage from a specific source entity. Fires EntityDamageByEntityEvent.",
          params: [
            { name: "amount", type: "double", description: "Damage to deal" },
            { name: "source", type: "Entity", description: "The attacking entity" },
          ],
        },
        {
          signature: "entity.isDead(): boolean",
          description: "Whether this entity is dead (health reached 0).",
          returns: { type: "boolean", description: "True if dead" },
        },
        {
          signature: "entity.target(): LivingEntity",
          description: "The entity this mob is currently targeting.",
          returns: { type: "LivingEntity", description: "Current target, or null" },
        },
        {
          signature: "entity.setTarget(LivingEntity target): void",
          description: "Sets the entity's target. The mob will attempt to attack this entity.",
          params: [{ name: "target", type: "LivingEntity", description: "The new target" }],
        },
      ],
    },
    {
      id: "player",
      title: "Player",
      content: "Extends `LivingEntity` and `PermissionHolder`. Represents an online player.",
      methods: [
        {
          signature: "player.sendMessage(String message): void",
          description: "Sends a chat message to the player.",
          params: [{ name: "message", type: "String", description: "The message" }],
        },
        {
          signature: "player.sendMessage(String message, MessageType type): void",
          description: "Sends a typed message to the player (with different visual treatment).",
          params: [
            { name: "message", type: "String", description: "The message" },
            { name: "type", type: "MessageType", description: "INFO, SUCCESS, WARNING, or ERROR" },
          ],
        },
        {
          signature: "player.itemInMainHand(): ItemStack",
          description: "Returns the item in the player's main hand.",
          returns: { type: "ItemStack", description: "The held item" },
        },
        {
          signature: "player.inventory(): Inventory",
          description: "Returns the player's inventory.",
          returns: { type: "Inventory", description: "The inventory" },
        },
        {
          signature: "player.targetBlock(int maxDistance): Block",
          description: "Returns the block the player is looking at, up to a max distance.",
          params: [{ name: "maxDistance", type: "int", description: "Maximum raycast distance in blocks" }],
          returns: { type: "Block", description: "The targeted block, or null" },
        },
        {
          signature: "player.facing(): BlockFace",
          description: "Returns the cardinal direction the player is facing.",
          returns: { type: "BlockFace", description: "NORTH, SOUTH, EAST, or WEST" },
        },
        {
          signature: "player.kick(String reason): void",
          description: "Kicks the player from the server with a reason message.",
          params: [{ name: "reason", type: "String", description: "The kick message" }],
        },
        {
          signature: "player.hasPlayedBefore(): boolean",
          description: "Whether this player has joined the server before.",
          returns: { type: "boolean", description: "True if returning player" },
        },
        {
          signature: "player.isOnline(): boolean",
          description: "Whether the player is currently online.",
          returns: { type: "boolean", description: "True if online" },
        },
        {
          signature: "player.level(): int",
          description: "The player's experience level.",
          returns: { type: "int", description: "The XP level" },
        },
      ],
      subsections: [
        {
          id: "message-type",
          title: "MessageType",
          enumValues: [
            { name: "INFO", description: "Informational message (default)" },
            { name: "SUCCESS", description: "Success/confirmation message" },
            { name: "WARNING", description: "Warning message" },
            { name: "ERROR", description: "Error message" },
          ],
        },
        {
          id: "game-mode",
          title: "Game Mode Checks",
          methods: [
            {
              signature: "player.isSneaking(): boolean",
              description: "Whether the player is sneaking (holding shift).",
              returns: { type: "boolean", description: "True if sneaking" },
            },
            {
              signature: "player.isCreativeMode(): boolean",
              description: "Whether the player is in creative mode.",
              returns: { type: "boolean", description: "True if creative" },
            },
            {
              signature: "player.isSurvivalMode(): boolean",
              description: "Whether the player is in survival mode.",
              returns: { type: "boolean", description: "True if survival" },
            },
            {
              signature: "player.isSpectatorMode(): boolean",
              description: "Whether the player is in spectator mode.",
              returns: { type: "boolean", description: "True if spectator" },
            },
          ],
        },
      ],
    },
    {
      id: "projectile",
      title: "Projectile",
      content: "Extends `Entity`. Represents a projectile in flight (arrows, fireballs, snowballs, etc.).",
      methods: [
        {
          signature: "projectile.shooter(): Entity",
          description: "Returns the entity that launched this projectile.",
          returns: { type: "Entity", description: "The shooter, or null" },
        },
      ],
    },
    {
      id: "tameable",
      title: "TameableEntity",
      content: "Extends `LivingEntity`. Represents an entity that can be tamed (wolves, cats, parrots).",
      methods: [
        {
          signature: "entity.isTamed(): boolean",
          description: "Whether this entity has been tamed.",
          returns: { type: "boolean", description: "True if tamed" },
        },
        {
          signature: "entity.ownerUniqueId(): UUID",
          description: "The UUID of the player who tamed this entity.",
          returns: { type: "UUID", description: "Owner's UUID, or null if untamed" },
        },
        {
          signature: "entity.owner(): Player",
          description: "The owner if they're currently online.",
          returns: { type: "Player", description: "The owner, or null" },
        },
      ],
    },
    {
      id: "entity-type",
      title: "EntityType",
      content: "An enum with 305 values covering every entity in the game. Each value has a category and convenience check methods.",
      methods: [
        {
          signature: "type.category(): Category",
          description: "The entity's category.",
          returns: { type: "Category", description: "PLAYER, PASSIVE, HOSTILE, NEUTRAL, PROJECTILE, VEHICLE, or MISC" },
        },
        {
          signature: "type.isHostile(): boolean",
          description: "Whether this is a hostile mob type.",
          returns: { type: "boolean", description: "True if hostile" },
        },
        {
          signature: "type.isPassive(): boolean",
          description: "Whether this is a passive mob type.",
          returns: { type: "boolean", description: "True if passive" },
        },
        {
          signature: "type.isProjectile(): boolean",
          description: "Whether this is a projectile type.",
          returns: { type: "boolean", description: "True if projectile" },
        },
        {
          signature: "type.isLiving(): boolean",
          description: "Whether this entity type represents a living entity.",
          returns: { type: "boolean", description: "True if living" },
        },
      ],
      subsections: [
        {
          id: "entity-type-examples",
          title: "Common Entity Types",
          content: "A few examples from each category:",
          fields: [
            { name: "PLAYER", type: "PLAYER", description: "The player entity" },
            { name: "ZOMBIE", type: "HOSTILE", description: "Standard zombie" },
            { name: "SKELETON", type: "HOSTILE", description: "Skeleton archer" },
            { name: "CREEPER", type: "HOSTILE", description: "Explosive creeper" },
            { name: "ENDER_DRAGON", type: "HOSTILE", description: "The ender dragon boss" },
            { name: "WARDEN", type: "HOSTILE", description: "The deep dark warden" },
            { name: "COW", type: "PASSIVE", description: "A cow" },
            { name: "VILLAGER", type: "PASSIVE", description: "A villager NPC" },
            { name: "IRON_GOLEM", type: "NEUTRAL", description: "Iron golem" },
            { name: "ARROW", type: "PROJECTILE", description: "A shot arrow" },
            { name: "FIREBALL", type: "PROJECTILE", description: "A ghast fireball" },
            { name: "BOAT", type: "VEHICLE", description: "A boat" },
            { name: "MINECART", type: "VEHICLE", description: "A minecart" },
            { name: "ITEM", type: "MISC", description: "A dropped item" },
            { name: "ARMOR_STAND", type: "MISC", description: "An armor stand" },
          ],
        },
      ],
    },
  ],
};
