import type { DocPage } from "../types";

export const blockEventsDoc: DocPage = {
  slug: "block-events",
  title: "Block Events",
  description: "Events fired when blocks are broken, placed, ignited, moved, and more.",
  category: "api",
  order: 2,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "Block events fire when the state of blocks in the world changes. All block events extend `BlockEvent` and provide a `block()` method to get the affected block.\n\nMost block events implement `Cancellable` — cancelling them prevents the block change from occurring.",
    },
    {
      id: "block-break",
      title: "BlockBreakEvent",
      content: "Fired when a player breaks a block. Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The block being broken.",
          returns: { type: "Block", description: "The block" },
        },
        {
          signature: "event.player(): Player",
          description: "The player breaking the block.",
          returns: { type: "Player", description: "The player" },
        },
      ],
      subsections: [
        {
          id: "block-break-example",
          title: "Example",
          code: `@EventHandler
public void onBlockBreak(BlockBreakEvent event) {
    if (event.block().type() == Material.DIAMOND_ORE) {
        event.player().sendMessage("You found diamonds!");
    }
}`,
          codeLang: "java",
        },
      ],
    },
    {
      id: "block-place",
      title: "BlockPlaceEvent",
      content: "Fired when a player places a block. Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The block that was placed.",
          returns: { type: "Block", description: "The placed block" },
        },
        {
          signature: "event.player(): Player",
          description: "The player who placed the block.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.replacedBlock(): Block",
          description: "The block that was replaced (e.g., air or water).",
          returns: { type: "Block", description: "The replaced block" },
        },
        {
          signature: "event.itemInHand(): ItemStack",
          description: "The item used to place the block.",
          returns: { type: "ItemStack", description: "The item in the player's hand" },
        },
      ],
    },
    {
      id: "block-ignite",
      title: "BlockIgniteEvent",
      content: "Fired when a block is set on fire. Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The block being ignited.",
          returns: { type: "Block", description: "The block" },
        },
        {
          signature: "event.cause(): IgniteCause",
          description: "What caused the ignition.",
          returns: { type: "IgniteCause", description: "The cause" },
        },
        {
          signature: "event.ignitingEntity(): Entity",
          description: "The entity that caused the ignition, if any.",
          returns: { type: "Entity", description: "The entity, or null" },
        },
        {
          signature: "event.ignitingBlock(): Block",
          description: "The block that caused the ignition (e.g., lava source), if any.",
          returns: { type: "Block", description: "The igniting block, or null" },
        },
      ],
      subsections: [
        {
          id: "ignite-causes",
          title: "IgniteCause",
          enumValues: [
            { name: "LAVA", description: "Ignited by nearby lava" },
            { name: "FLINT_AND_STEEL", description: "Ignited by a player using flint and steel" },
            { name: "SPREAD", description: "Fire spread from an adjacent block" },
            { name: "LIGHTNING", description: "Struck by lightning" },
            { name: "FIREBALL", description: "Hit by a fireball (ghast, blaze, etc.)" },
            { name: "EXPLOSION", description: "Ignited by an explosion" },
            { name: "ARROW", description: "Hit by a flaming arrow" },
          ],
        },
      ],
    },
    {
      id: "block-burn",
      title: "BlockBurnEvent",
      content: "Fired when a block is destroyed by fire. Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The block being burned.",
          returns: { type: "Block", description: "The block" },
        },
        {
          signature: "event.ignitingBlock(): Block",
          description: "The fire block that caused this.",
          returns: { type: "Block", description: "The fire block" },
        },
      ],
    },
    {
      id: "block-explode",
      title: "BlockExplodeEvent",
      content: "Fired when a block (e.g., TNT, bed in the Nether) causes an explosion. Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The block that exploded.",
          returns: { type: "Block", description: "The exploding block" },
        },
        {
          signature: "event.affectedBlocks(): List<Block>",
          description: "The blocks affected by the explosion. This list is mutable — remove blocks from it to protect them from destruction.",
          returns: { type: "List<Block>", description: "Mutable list of affected blocks" },
        },
      ],
    },
    {
      id: "block-dispense",
      title: "BlockDispenseEvent",
      content: "Fired when a dispenser or dropper ejects an item. Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The dispenser/dropper block.",
          returns: { type: "Block", description: "The block" },
        },
        {
          signature: "event.item(): ItemStack",
          description: "The item being dispensed.",
          returns: { type: "ItemStack", description: "The item" },
        },
      ],
    },
    {
      id: "block-form",
      title: "BlockFormEvent",
      content: "Fired when a block forms naturally (e.g., snow, ice, cobblestone from lava+water). Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The block where formation is occurring.",
          returns: { type: "Block", description: "The block" },
        },
        {
          signature: "event.newType(): Material",
          description: "The material the block will become.",
          returns: { type: "Material", description: "The new material" },
        },
      ],
    },
    {
      id: "block-from-to",
      title: "BlockFromToEvent",
      content: "Fired when a liquid (water or lava) flows from one block to another. Cancellable.",
      methods: [
        {
          signature: "event.fromBlock(): Block",
          description: "The source block of the flow.",
          returns: { type: "Block", description: "The source block" },
        },
        {
          signature: "event.toBlock(): Block",
          description: "The destination block.",
          returns: { type: "Block", description: "The destination block" },
        },
      ],
    },
    {
      id: "block-piston",
      title: "BlockPistonEvent",
      content: "Fired when a piston extends or retracts. Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The piston block.",
          returns: { type: "Block", description: "The piston" },
        },
        {
          signature: "event.direction(): BlockFace",
          description: "The direction the piston is pushing/pulling.",
          returns: { type: "BlockFace", description: "The direction" },
        },
        {
          signature: "event.movedBlocks(): List<Block>",
          description: "All blocks being moved by this piston action.",
          returns: { type: "List<Block>", description: "The moved blocks" },
        },
        {
          signature: "event.isExtending(): boolean",
          description: "Whether the piston is extending (true) or retracting (false).",
          returns: { type: "boolean", description: "True if extending" },
        },
      ],
    },
    {
      id: "block-spread",
      title: "BlockSpreadEvent",
      content: "Fired when a block spreads to an adjacent position (fire, mushrooms, sculk). Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The block where the spread is occurring.",
          returns: { type: "Block", description: "The destination block" },
        },
        {
          signature: "event.source(): Block",
          description: "The source block of the spread.",
          returns: { type: "Block", description: "The source" },
        },
      ],
    },
    {
      id: "sign-change",
      title: "SignChangeEvent",
      content: "Fired when a player edits a sign. Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The sign block.",
          returns: { type: "Block", description: "The sign" },
        },
        {
          signature: "event.player(): Player",
          description: "The player editing the sign.",
          returns: { type: "Player", description: "The player" },
        },
        {
          signature: "event.lines(): String[]",
          description: "All four lines of the sign.",
          returns: { type: "String[]", description: "Array of 4 strings" },
        },
        {
          signature: "event.line(int index): String",
          description: "Gets a specific line of the sign.",
          params: [{ name: "index", type: "int", description: "Line index (0-3)" }],
          returns: { type: "String", description: "The line text" },
        },
        {
          signature: "event.setLine(int index, String line): void",
          description: "Sets a specific line of the sign.",
          params: [
            { name: "index", type: "int", description: "Line index (0-3)" },
            { name: "line", type: "String", description: "The new text" },
          ],
        },
      ],
    },
    {
      id: "structure-grow",
      title: "StructureGrowEvent",
      content: "Fired when a tree or giant mushroom grows. Cancellable.",
      methods: [
        {
          signature: "event.block(): Block",
          description: "The sapling or mushroom block that initiated the growth.",
          returns: { type: "Block", description: "The source block" },
        },
        {
          signature: "event.player(): Player",
          description: "The player who applied bonemeal, if any.",
          returns: { type: "Player", description: "The player, or null for natural growth" },
        },
        {
          signature: "event.affectedPositions(): List<BlockPosition>",
          description: "All positions that will be changed by this growth.",
          returns: { type: "List<BlockPosition>", description: "Affected positions" },
        },
      ],
    },
  ],
};
