import type { DocPage } from "../types";

export const inventoryDoc: DocPage = {
  slug: "inventory",
  title: "Inventory & Items",
  description: "ItemStack, Inventory, and Material APIs for working with items and blocks.",
  category: "api",
  order: 7,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "The inventory API lets you create, inspect, and manipulate items and inventories. The three key types are:\n\n`Material` — An enum of all block and item types in the game (240+ values).\n`ItemStack` — A stack of items with a type, amount, and persistent custom data.\n`Inventory` — A container that holds ItemStacks (player inventory, chests, etc.).\n\nFor advanced GUIs with typed slots, progress bars, and synced properties, see **GUI Menus** (`/docs/gui-menus`). For client-side screen widgets, see **GUI Screens & Widgets** (`/docs/gui-screens`). For inventory/menu events, see **Inventory & Menu Events** (`/docs/inventory-events`).",
    },
    {
      id: "material",
      title: "Material",
      content: "An enum with 240+ values covering every block and item type. Each material knows whether it's a block, whether it's solid, and other properties.",
      methods: [
        {
          signature: "material.isBlock(): boolean",
          description: "Whether this material can be placed as a block.",
          returns: { type: "boolean", description: "True if it's a block type" },
        },
        {
          signature: "material.isSolid(): boolean",
          description: "Whether this material is solid (entities can stand on it).",
          returns: { type: "boolean", description: "True if solid" },
        },
        {
          signature: "material.isAir(): boolean",
          description: "Whether this material is air (empty).",
          returns: { type: "boolean", description: "True if air" },
        },
        {
          signature: "material.isLiquid(): boolean",
          description: "Whether this material is a liquid (water or lava).",
          returns: { type: "boolean", description: "True if liquid" },
        },
        {
          signature: "material.isInteractable(): boolean",
          description: "Whether right-clicking this block opens a UI or performs an action.",
          returns: { type: "boolean", description: "True if interactable" },
        },
        {
          signature: "material.isContainer(): boolean",
          description: "Whether this block can hold items (chest, barrel, hopper, etc.).",
          returns: { type: "boolean", description: "True if it's a container" },
        },
      ],
      subsections: [
        {
          id: "material-categories",
          title: "Material Categories",
          content: "Materials span many categories. Here are some highlights:",
          fields: [
            { name: "STONE, GRANITE, DIORITE, ...", type: "Block", description: "Stone variants (15+ types)" },
            { name: "OAK_LOG, BIRCH_PLANKS, ...", type: "Block", description: "Wood types (40+ including doors, fences, stairs)" },
            { name: "DIAMOND_ORE, IRON_ORE, ...", type: "Block", description: "Ores and minerals (14 types)" },
            { name: "CHEST, BARREL, HOPPER, ...", type: "Block", description: "Containers (13 types)" },
            { name: "WATER, LAVA", type: "Block", description: "Liquids" },
            { name: "DIAMOND_SWORD, IRON_AXE, ...", type: "Item", description: "Weapons and tools (42 types)" },
            { name: "WHEAT_SEEDS, CARROT, ...", type: "Item", description: "Plants and crops (19 types)" },
          ],
        },
        {
          id: "material-checks",
          title: "Specialized Checks",
          methods: [
            {
              signature: "material.isDoor(): boolean",
              description: "Whether this is a door block.",
              returns: { type: "boolean", description: "True if door" },
            },
            {
              signature: "material.isTrapdoor(): boolean",
              description: "Whether this is a trapdoor block.",
              returns: { type: "boolean", description: "True if trapdoor" },
            },
            {
              signature: "material.isFenceGate(): boolean",
              description: "Whether this is a fence gate block.",
              returns: { type: "boolean", description: "True if fence gate" },
            },
            {
              signature: "material.isButton(): boolean",
              description: "Whether this is a button block.",
              returns: { type: "boolean", description: "True if button" },
            },
            {
              signature: "material.isBed(): boolean",
              description: "Whether this is a bed block.",
              returns: { type: "boolean", description: "True if bed" },
            },
            {
              signature: "material.isSign(): boolean",
              description: "Whether this is a sign block.",
              returns: { type: "boolean", description: "True if sign" },
            },
          ],
        },
      ],
    },
    {
      id: "item-stack",
      title: "ItemStack",
      content: "Represents a stack of items. ItemStacks have a type, an amount, and support persistent key-value data.",
      methods: [
        {
          signature: "item.type(): Material",
          description: "The material type of this item.",
          returns: { type: "Material", description: "The material" },
        },
        {
          signature: "item.amount(): int",
          description: "The number of items in this stack.",
          returns: { type: "int", description: "Stack size" },
        },
        {
          signature: "item.setAmount(int amount): void",
          description: "Sets the stack size.",
          params: [{ name: "amount", type: "int", description: "New stack size" }],
        },
        {
          signature: "item.isEmpty(): boolean",
          description: "Whether this stack is empty (amount is 0 or material is AIR).",
          returns: { type: "boolean", description: "True if empty" },
        },
        {
          signature: "item.copy(): ItemStack",
          description: "Creates a deep copy of this item stack.",
          returns: { type: "ItemStack", description: "A new copy" },
        },
      ],
      subsections: [
        {
          id: "item-data",
          title: "Persistent Item Data",
          content: "Store custom key-value data directly on items. This data persists when items are moved, stored, or dropped.",
          methods: [
            {
              signature: "item.hasData(String key): boolean",
              description: "Checks if this item has a custom data key.",
              params: [{ name: "key", type: "String", description: "The data key" }],
              returns: { type: "boolean", description: "True if the key exists" },
            },
            {
              signature: "item.getData(String key): String",
              description: "Gets a custom data value from this item.",
              params: [{ name: "key", type: "String", description: "The data key" }],
              returns: { type: "String", description: "The value, or null" },
            },
            {
              signature: "item.setData(String key, String value): void",
              description: "Sets a custom data value on this item.",
              params: [
                { name: "key", type: "String", description: "The data key" },
                { name: "value", type: "String", description: "The value" },
              ],
            },
            {
              signature: "item.removeData(String key): void",
              description: "Removes a custom data key from this item.",
              params: [{ name: "key", type: "String", description: "The data key" }],
            },
          ],
          subsections: [
            {
              id: "item-data-example",
              title: "Example",
              code: `// Create a custom "magic wand" item
ItemStack wand = player.itemInMainHand();
wand.setData("mymod:magic_type", "fire");
wand.setData("mymod:charges", "10");

// Later, check the item
if (item.hasData("mymod:magic_type")) {
    String type = item.getData("mymod:magic_type");
    int charges = Integer.parseInt(item.getData("mymod:charges"));
}`,
              codeLang: "java",
            },
          ],
        },
      ],
    },
    {
      id: "inventory",
      title: "Inventory",
      content: "A container that holds ItemStacks. Access a player's inventory via `player.inventory()`. Also used for chests, dispensers, and other container blocks.",
      methods: [
        {
          signature: "inventory.size(): int",
          description: "The number of slots in this inventory.",
          returns: { type: "int", description: "Slot count" },
        },
        {
          signature: "inventory.item(int slot): ItemStack",
          description: "Gets the item in a specific slot.",
          params: [{ name: "slot", type: "int", description: "Slot index (0-based)" }],
          returns: { type: "ItemStack", description: "The item, or empty stack" },
        },
        {
          signature: "inventory.setItem(int slot, ItemStack item): void",
          description: "Sets the item in a specific slot.",
          params: [
            { name: "slot", type: "int", description: "Slot index" },
            { name: "item", type: "ItemStack", description: "The item to place" },
          ],
        },
        {
          signature: "inventory.addItem(ItemStack item): ItemStack",
          description: "Adds an item to the first available slot. Returns any overflow that didn't fit.",
          params: [{ name: "item", type: "ItemStack", description: "The item to add" }],
          returns: { type: "ItemStack", description: "Overflow items, or empty stack" },
        },
        {
          signature: "inventory.contains(Material material): boolean",
          description: "Checks if the inventory contains at least one item of the given material.",
          params: [{ name: "material", type: "Material", description: "The material to check for" }],
          returns: { type: "boolean", description: "True if found" },
        },
        {
          signature: "inventory.isEmpty(): boolean",
          description: "Whether all slots are empty.",
          returns: { type: "boolean", description: "True if empty" },
        },
        {
          signature: "inventory.clear(): void",
          description: "Removes all items from the inventory.",
        },
      ],
      subsections: [
        {
          id: "inventory-example",
          title: "Example",
          code: `// Give a player 64 diamonds
Inventory inv = player.inventory();
ItemStack diamonds = /* create diamond stack */;
diamonds.setAmount(64);

ItemStack overflow = inv.addItem(diamonds);
if (!overflow.isEmpty()) {
    player.sendMessage("Your inventory is full! "
        + overflow.amount() + " diamonds couldn't fit.");
}

// Check if player has a specific item
if (inv.contains(Material.DIAMOND_PICKAXE)) {
    player.sendMessage("You have a diamond pickaxe!");
}`,
          codeLang: "java",
        },
      ],
    },
  ],
};
