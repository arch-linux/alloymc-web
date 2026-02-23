import type { DocPage } from "../types";

export const entityEventsDoc: DocPage = {
  slug: "entity-events",
  title: "Entity Events",
  description: "Events fired when entities take damage, die, spawn, explode, and interact.",
  category: "api",
  order: 3,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "Entity events fire when something happens to or because of an entity. All entity events extend `EntityEvent` and provide an `entity()` method. This category covers damage, death, spawning, targeting, explosions, and more.\n\nFor player-specific events (join, chat, interact), see the Player Events page.",
    },
    {
      id: "entity-damage",
      title: "EntityDamageEvent",
      content: "Fired when an entity takes damage from any source. Cancellable.",
      methods: [
        {
          signature: "event.entity(): Entity",
          description: "The entity taking damage.",
          returns: { type: "Entity", description: "The damaged entity" },
        },
        {
          signature: "event.cause(): DamageCause",
          description: "What caused the damage.",
          returns: { type: "DamageCause", description: "The damage cause" },
        },
        {
          signature: "event.damage(): double",
          description: "The amount of damage being dealt.",
          returns: { type: "double", description: "Damage amount" },
        },
        {
          signature: "event.setDamage(double damage): void",
          description: "Modify the damage amount.",
          params: [{ name: "damage", type: "double", description: "New damage value" }],
        },
      ],
      subsections: [
        {
          id: "damage-cause",
          title: "DamageCause",
          enumValues: [
            { name: "ENTITY_ATTACK", description: "Melee attack from another entity" },
            { name: "PROJECTILE", description: "Hit by a projectile (arrow, fireball, etc.)" },
            { name: "FIRE", description: "Standing in fire" },
            { name: "FIRE_TICK", description: "Burning from being on fire" },
            { name: "LAVA", description: "Standing in lava" },
            { name: "DROWNING", description: "Underwater with no air" },
            { name: "FALL", description: "Fall damage" },
            { name: "VOID", description: "Fell into the void" },
            { name: "LIGHTNING", description: "Struck by lightning" },
            { name: "POISON", description: "Poison effect" },
            { name: "WITHER", description: "Wither effect" },
            { name: "MAGIC", description: "Instant damage or harmful splash potions" },
            { name: "STARVATION", description: "Hunger damage" },
            { name: "SUFFOCATION", description: "Inside a solid block" },
            { name: "EXPLOSION", description: "Caught in an explosion" },
            { name: "CONTACT", description: "Contact damage (cactus, berry bush)" },
            { name: "CRAMMING", description: "Too many entities in one space" },
            { name: "THORNS", description: "Thorns enchantment" },
            { name: "SONIC_BOOM", description: "Warden's sonic boom attack" },
            { name: "FREEZE", description: "Powder snow freeze damage" },
            { name: "CUSTOM", description: "Custom damage from mods" },
          ],
        },
      ],
    },
    {
      id: "entity-damage-by-entity",
      title: "EntityDamageByEntityEvent",
      content: "Extends `EntityDamageEvent`. Fired when damage is dealt by another entity. Cancellable.",
      methods: [
        {
          signature: "event.damager(): Entity",
          description: "The entity that dealt the damage. For projectiles, this is the projectile itself — use `((Projectile) damager).shooter()` to get the original attacker.",
          returns: { type: "Entity", description: "The attacking entity or projectile" },
        },
      ],
      subsections: [
        {
          id: "entity-damage-by-entity-example",
          title: "Example",
          code: `@EventHandler
public void onDamage(EntityDamageByEntityEvent event) {
    if (event.damager() instanceof Player attacker) {
        attacker.sendMessage("You dealt " + event.damage() + " damage!");
    }
}`,
          codeLang: "java",
        },
      ],
    },
    {
      id: "entity-death",
      title: "EntityDeathEvent",
      content: "Fired when a living entity dies. Not cancellable — the entity is already dead.",
      methods: [
        {
          signature: "event.entity(): LivingEntity",
          description: "The entity that died.",
          returns: { type: "LivingEntity", description: "The dead entity" },
        },
        {
          signature: "event.drops(): List<ItemStack>",
          description: "The items that will be dropped. This list is mutable — add, remove, or replace items.",
          returns: { type: "List<ItemStack>", description: "Mutable list of drops" },
        },
        {
          signature: "event.droppedExp(): int",
          description: "The amount of experience to drop.",
          returns: { type: "int", description: "Experience amount" },
        },
        {
          signature: "event.setDroppedExp(int exp): void",
          description: "Set the amount of experience to drop.",
          params: [{ name: "exp", type: "int", description: "New experience amount" }],
        },
      ],
    },
    {
      id: "entity-spawn",
      title: "EntitySpawnEvent",
      content: "Fired when an entity is about to spawn in the world. Cancellable.",
      methods: [
        {
          signature: "event.entity(): Entity",
          description: "The entity being spawned.",
          returns: { type: "Entity", description: "The entity" },
        },
        {
          signature: "event.reason(): SpawnReason",
          description: "Why this entity is spawning.",
          returns: { type: "SpawnReason", description: "The spawn reason" },
        },
      ],
      subsections: [
        {
          id: "spawn-reason",
          title: "SpawnReason",
          enumValues: [
            { name: "NATURAL", description: "Normal mob spawning" },
            { name: "SPAWNER", description: "Spawned by a mob spawner" },
            { name: "EGG", description: "Spawned from a spawn egg" },
            { name: "BREEDING", description: "Animal breeding" },
            { name: "BUILD_IRONGOLEM", description: "Iron golem built by a player" },
            { name: "BUILD_SNOWMAN", description: "Snow golem built by a player" },
            { name: "VILLAGE_DEFENSE", description: "Iron golem defending a village" },
            { name: "RAID", description: "Part of a village raid" },
            { name: "CUSTOM", description: "Spawned by a mod" },
            { name: "DEFAULT", description: "Default/unknown reason" },
          ],
        },
      ],
    },
    {
      id: "entity-interact",
      title: "EntityInteractEvent",
      content: "Fired when an entity physically interacts with a block (e.g., a mob stepping on a pressure plate). Cancellable.",
      methods: [
        {
          signature: "event.entity(): Entity",
          description: "The entity interacting.",
          returns: { type: "Entity", description: "The entity" },
        },
        {
          signature: "event.block(): Block",
          description: "The block being interacted with.",
          returns: { type: "Block", description: "The block" },
        },
      ],
    },
    {
      id: "entity-change-block",
      title: "EntityChangeBlockEvent",
      content: "Fired when an entity changes a block (e.g., enderman picking up a block, sheep eating grass). Cancellable.",
      methods: [
        {
          signature: "event.entity(): Entity",
          description: "The entity changing the block.",
          returns: { type: "Entity", description: "The entity" },
        },
        {
          signature: "event.block(): Block",
          description: "The block being changed.",
          returns: { type: "Block", description: "The block" },
        },
        {
          signature: "event.toType(): Material",
          description: "The material the block will become.",
          returns: { type: "Material", description: "New material (e.g., AIR for enderman pickup)" },
        },
      ],
    },
    {
      id: "entity-target",
      title: "EntityTargetEvent",
      content: "Fired when a mob targets or un-targets another entity. Cancellable.",
      methods: [
        {
          signature: "event.entity(): Entity",
          description: "The mob that is targeting.",
          returns: { type: "Entity", description: "The targeting mob" },
        },
        {
          signature: "event.target(): Entity",
          description: "The entity being targeted. Null when un-targeting.",
          returns: { type: "Entity", description: "The target, or null" },
        },
        {
          signature: "event.setTarget(Entity target): void",
          description: "Change the target. Set to null to clear targeting.",
          params: [{ name: "target", type: "Entity", description: "The new target" }],
        },
      ],
    },
    {
      id: "entity-explode",
      title: "EntityExplodeEvent",
      content: "Fired when an entity (creeper, TNT entity, etc.) causes an explosion. Cancellable.",
      methods: [
        {
          signature: "event.entity(): Entity",
          description: "The entity that exploded.",
          returns: { type: "Entity", description: "The entity" },
        },
        {
          signature: "event.affectedBlocks(): List<Block>",
          description: "The blocks affected by the explosion. Mutable — remove blocks to protect them.",
          returns: { type: "List<Block>", description: "Mutable list of affected blocks" },
        },
      ],
    },
    {
      id: "entity-pickup-item",
      title: "EntityPickupItemEvent",
      content: "Fired when an entity picks up an item from the ground. Cancellable.",
      methods: [
        {
          signature: "event.entity(): Entity",
          description: "The entity picking up the item.",
          returns: { type: "Entity", description: "The entity" },
        },
        {
          signature: "event.itemEntity(): Entity",
          description: "The item entity being picked up.",
          returns: { type: "Entity", description: "The item entity" },
        },
      ],
    },
    {
      id: "hanging-events",
      title: "Hanging Entity Events",
      content: "Events for hanging entities like paintings and item frames.",
      subsections: [
        {
          id: "hanging-break",
          title: "HangingBreakEvent",
          content: "Fired when a hanging entity is broken. Cancellable.",
          methods: [
            {
              signature: "event.entity(): Entity",
              description: "The hanging entity being broken.",
              returns: { type: "Entity", description: "The painting or item frame" },
            },
            {
              signature: "event.cause(): RemoveCause",
              description: "Why the entity is being removed.",
              returns: { type: "RemoveCause", description: "The removal cause" },
            },
            {
              signature: "event.remover(): Entity",
              description: "The entity that broke this, if caused by an entity.",
              returns: { type: "Entity", description: "The remover, or null" },
            },
          ],
          subsections: [
            {
              id: "remove-cause",
              title: "RemoveCause",
              enumValues: [
                { name: "ENTITY", description: "Broken by a player or mob" },
                { name: "EXPLOSION", description: "Destroyed by an explosion" },
                { name: "PHYSICS", description: "Support block removed" },
                { name: "DEFAULT", description: "Unknown cause" },
              ],
            },
          ],
        },
        {
          id: "hanging-place",
          title: "HangingPlaceEvent",
          content: "Fired when a player places a painting or item frame. Cancellable.",
          methods: [
            {
              signature: "event.entity(): Entity",
              description: "The hanging entity being placed.",
              returns: { type: "Entity", description: "The painting or item frame" },
            },
            {
              signature: "event.player(): Player",
              description: "The player placing it.",
              returns: { type: "Player", description: "The player" },
            },
          ],
        },
      ],
    },
    {
      id: "other-events",
      title: "Other Entity Events",
      subsections: [
        {
          id: "item-spawn",
          title: "ItemSpawnEvent",
          content: "Fired when a dropped item entity appears in the world. Cancellable.",
        },
        {
          id: "vehicle-damage",
          title: "VehicleDamageEvent",
          content: "Fired when a vehicle (boat, minecart) takes damage. Cancellable.",
          methods: [
            {
              signature: "event.entity(): Entity",
              description: "The vehicle entity.",
              returns: { type: "Entity", description: "The vehicle" },
            },
            {
              signature: "event.attacker(): Entity",
              description: "The entity that attacked the vehicle.",
              returns: { type: "Entity", description: "The attacker" },
            },
            {
              signature: "event.damage(): double",
              description: "The damage dealt.",
              returns: { type: "double", description: "Damage amount" },
            },
          ],
        },
        {
          id: "potion-splash",
          title: "PotionSplashEvent",
          content: "Fired when a splash potion lands. Cancellable.",
          methods: [
            {
              signature: "event.entity(): Entity",
              description: "The potion entity.",
              returns: { type: "Entity", description: "The splash potion" },
            },
            {
              signature: "event.affectedEntities(): Collection<LivingEntity>",
              description: "All living entities affected by the splash.",
              returns: { type: "Collection<LivingEntity>", description: "Affected entities" },
            },
          ],
        },
      ],
    },
  ],
};
