import type { DocPage } from "../types";

export const guiMenusDoc: DocPage = {
  slug: "gui-menus",
  title: "GUI Menus",
  description:
    "MenuLayout builder, SlotType, DataProperty, and MenuInstance for building complex machine screens.",
  category: "api",
  order: 8,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "The GUI menu system lets you build custom machine screens with positioned slots, typed slot behavior, and synced data properties — without writing custom packets.\n\nFor simple chest-style GUIs (1-6 rows of plain slots), use `CustomInventory`. For anything more complex — furnaces, energy cells, crafting stations — use `MenuLayout`.",
    },
    {
      id: "menu-layout",
      title: "MenuLayout",
      content:
        "A MenuLayout defines the structure of a custom menu: title, row count, slot positions/types, and synced data properties. Build one with `AlloyAPI.menuFactory().builder(title, rows)`.",
      methods: [
        {
          signature: "layout.title(): String",
          description: "The display title shown at the top of the GUI.",
          returns: { type: "String", description: "The title" },
        },
        {
          signature: "layout.rows(): int",
          description: "The number of rows in the underlying container (1-6).",
          returns: { type: "int", description: "Row count" },
        },
        {
          signature: "layout.slots(): List<SlotDefinition>",
          description: "All defined slots in this layout.",
          returns: {
            type: "List<SlotDefinition>",
            description: "Immutable list of slot definitions",
          },
        },
        {
          signature: "layout.properties(): List<DataProperty>",
          description: "All synced data properties.",
          returns: {
            type: "List<DataProperty>",
            description: "Immutable list of properties",
          },
        },
        {
          signature: "layout.property(String name): DataProperty",
          description: "Looks up a data property by name.",
          params: [
            { name: "name", type: "String", description: "The property name" },
          ],
          returns: {
            type: "DataProperty",
            description: "The property, or null if not found",
          },
        },
      ],
    },
    {
      id: "builder",
      title: "MenuLayout.Builder",
      content:
        "The builder provides a fluent API for defining slots and properties.",
      methods: [
        {
          signature:
            "builder.slot(int index, int x, int y, SlotType type): Builder",
          description: "Adds a slot at the given pixel position.",
          params: [
            { name: "index", type: "int", description: "Container slot index" },
            {
              name: "x",
              type: "int",
              description: "X pixel position (left edge)",
            },
            {
              name: "y",
              type: "int",
              description: "Y pixel position (top edge)",
            },
            { name: "type", type: "SlotType", description: "Slot behavior" },
          ],
          returns: { type: "Builder", description: "This builder" },
        },
        {
          signature:
            "builder.slot(int index, int x, int y, SlotType type, Predicate<ItemStack> filter): Builder",
          description: "Adds a slot with an item filter predicate.",
          params: [
            { name: "index", type: "int", description: "Container slot index" },
            { name: "x", type: "int", description: "X pixel position" },
            { name: "y", type: "int", description: "Y pixel position" },
            { name: "type", type: "SlotType", description: "Slot behavior" },
            {
              name: "filter",
              type: "Predicate<ItemStack>",
              description: "Controls which items can be placed",
            },
          ],
          returns: { type: "Builder", description: "This builder" },
        },
        {
          signature: "builder.row(int startIndex, int y): Builder",
          description:
            "Adds a full 9-column row of NORMAL slots at the given Y position.",
          params: [
            {
              name: "startIndex",
              type: "int",
              description: "Starting slot index",
            },
            { name: "y", type: "int", description: "Y pixel position" },
          ],
          returns: { type: "Builder", description: "This builder" },
        },
        {
          signature:
            "builder.property(String name, int index): Builder",
          description:
            "Registers a synced data property (auto-synced via MC ContainerData).",
          params: [
            {
              name: "name",
              type: "String",
              description: "Human-readable property name",
            },
            {
              name: "index",
              type: "int",
              description: "ContainerData index",
            },
          ],
          returns: { type: "Builder", description: "This builder" },
        },
        {
          signature: "builder.build(): MenuLayout",
          description: "Builds the menu layout.",
          returns: { type: "MenuLayout", description: "The constructed layout" },
        },
      ],
    },
    {
      id: "slot-type",
      title: "SlotType",
      content:
        "Controls the insert/extract behavior of a slot.",
      enumValues: [
        {
          name: "NORMAL",
          description: "Players can freely insert and extract items.",
        },
        {
          name: "INPUT",
          description:
            "Players can insert items; extraction requires shift-click or automation.",
        },
        {
          name: "OUTPUT",
          description:
            "Players can only take items out (e.g., furnace result slot).",
        },
        {
          name: "FUEL",
          description: "Accepts only fuel items (coal, charcoal, etc.).",
        },
        {
          name: "DISPLAY",
          description: "No interaction allowed; purely visual.",
        },
      ],
    },
    {
      id: "slot-definition",
      title: "SlotDefinition",
      content:
        "A record defining a single slot's position, type, and optional item filter.",
      fields: [
        {
          name: "index",
          type: "int",
          description: "The slot index in the container (0-based)",
        },
        {
          name: "x",
          type: "int",
          description: "X pixel position in the GUI",
        },
        {
          name: "y",
          type: "int",
          description: "Y pixel position in the GUI",
        },
        {
          name: "type",
          type: "SlotType",
          description: "The slot behavior type",
        },
        {
          name: "filter",
          type: "Predicate<ItemStack>",
          description:
            "Optional filter; null means any item is accepted",
        },
      ],
      methods: [
        {
          signature: "slot.accepts(ItemStack item): boolean",
          description:
            "Whether the given item is allowed in this slot. Returns false for DISPLAY and OUTPUT slots.",
          returns: { type: "boolean", description: "True if the item can be placed" },
        },
        {
          signature: "slot.allowsExtract(): boolean",
          description: "Whether players can take items from this slot. False for DISPLAY slots.",
          returns: { type: "boolean", description: "True if extraction is allowed" },
        },
      ],
    },
    {
      id: "data-property",
      title: "DataProperty",
      content:
        "A named integer property that syncs automatically between server and client via Minecraft's ContainerData. Properties are 16-bit signed values (-32768 to 32767).\n\nFor values larger than 16 bits, split across two properties and combine: `(highProp << 16) | (lowProp & 0xFFFF)`.",
      methods: [
        {
          signature: "prop.name(): String",
          description: "The property name.",
          returns: { type: "String", description: "The name" },
        },
        {
          signature: "prop.get(): int",
          description: "The current value.",
          returns: { type: "int", description: "The value" },
        },
        {
          signature: "prop.set(int value): void",
          description: "Sets the value (clamped to 16-bit signed range).",
          params: [
            { name: "value", type: "int", description: "The new value" },
          ],
        },
      ],
    },
    {
      id: "menu-instance",
      title: "MenuInstance",
      content:
        "A live, open menu for a player. Get/set items and properties in real-time. Obtain via `player.openMenu(layout)`.",
      methods: [
        {
          signature: "menu.layout(): MenuLayout",
          description: "The layout this instance was created from.",
          returns: { type: "MenuLayout", description: "The layout" },
        },
        {
          signature: "menu.viewer(): Player",
          description: "The player viewing this menu.",
          returns: { type: "Player", description: "The viewer" },
        },
        {
          signature: "menu.item(int slot): ItemStack",
          description: "Gets the item in the given slot.",
          params: [
            { name: "slot", type: "int", description: "Slot index" },
          ],
          returns: { type: "ItemStack", description: "The item, or null" },
        },
        {
          signature: "menu.setItem(int slot, ItemStack item): void",
          description: "Sets the item in a slot. Updates are sent to the client.",
          params: [
            { name: "slot", type: "int", description: "Slot index" },
            { name: "item", type: "ItemStack", description: "The item" },
          ],
        },
        {
          signature: "menu.getProperty(String name): int",
          description: "Gets a synced property value by name.",
          params: [
            { name: "name", type: "String", description: "Property name" },
          ],
          returns: { type: "int", description: "The current value" },
        },
        {
          signature: "menu.setProperty(String name, int value): void",
          description: "Sets a synced property. The new value is sent to the client.",
          params: [
            { name: "name", type: "String", description: "Property name" },
            { name: "value", type: "int", description: "New value" },
          ],
        },
        {
          signature: "menu.close(): void",
          description: "Closes this menu for the viewer.",
        },
      ],
    },
    {
      id: "menu-factory",
      title: "MenuFactory",
      content:
        "Factory for creating MenuLayout builders. Access via `AlloyAPI.menuFactory()`.",
      methods: [
        {
          signature:
            "AlloyAPI.menuFactory().builder(String title, int rows): MenuLayout.Builder",
          description: "Creates a new menu layout builder.",
          params: [
            { name: "title", type: "String", description: "Display title" },
            { name: "rows", type: "int", description: "Number of rows (1-6)" },
          ],
          returns: { type: "MenuLayout.Builder", description: "A new builder" },
        },
      ],
    },
    {
      id: "furnace-example",
      title: "Example: Furnace GUI",
      code: `// Define a furnace-style layout
MenuLayout layout = AlloyAPI.menuFactory().builder("Alloy Smelter", 3)
    .slot(0, 56, 17, SlotType.INPUT)          // Input slot (top)
    .slot(1, 56, 53, SlotType.FUEL)           // Fuel slot (bottom)
    .slot(2, 116, 35, SlotType.OUTPUT)        // Output slot (right)
    .property("progress", 0)                   // Smelt progress (0-200)
    .property("fuel", 1)                       // Remaining fuel (0-1600)
    .build();

// Open for a player
MenuInstance menu = player.openMenu(layout);

// Update progress from a tick handler
menu.setProperty("progress", currentProgress);
menu.setProperty("fuel", remainingFuel);

// Place result when done
menu.setItem(2, ItemStack.create(Material.IRON_INGOT, 1));`,
      codeLang: "java",
    },
    {
      id: "energy-cell-example",
      title: "Example: Energy Cell",
      code: `// Energy cell with input/output and display slots
MenuLayout layout = AlloyAPI.menuFactory().builder("Energy Cell", 3)
    .slot(0, 44, 35, SlotType.INPUT, item ->
        item.hasData("alloy:energy_item"))     // Only accept energy items
    .slot(1, 116, 35, SlotType.OUTPUT)         // Discharged items come out here
    .slot(2, 80, 8, SlotType.DISPLAY)          // Display current charge item
    .property("energy_low", 0)                  // Low 16 bits of energy
    .property("energy_high", 1)                 // High 16 bits of energy
    .build();

MenuInstance menu = player.openMenu(layout);

// Sync a 32-bit energy value across two properties
int energy = 150000;
menu.setProperty("energy_low", energy & 0xFFFF);
menu.setProperty("energy_high", (energy >> 16) & 0xFFFF);`,
      codeLang: "java",
    },
  ],
};
