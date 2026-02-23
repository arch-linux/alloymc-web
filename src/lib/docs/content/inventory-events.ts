import type { DocPage } from "../types";

export const inventoryEventsDoc: DocPage = {
  slug: "inventory-events",
  title: "Inventory & Menu Events",
  description:
    "All inventory and menu events: clicks, opens, closes, drags, and menu-specific interactions.",
  category: "api",
  order: 10,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "Inventory events fire when players interact with custom Alloy GUIs. There are two categories:\n\n**Inventory events** — for simple `CustomInventory` chest-style GUIs.\n**Menu events** — for `MenuLayout` machine screens with typed slots and properties.\n\nAll cancellable events prevent the default Minecraft behavior when cancelled.",
    },
    {
      id: "inventory-click-event",
      title: "InventoryClickEvent",
      content:
        "Fired when a player clicks a slot in a `CustomInventory`. Cancelling prevents item pickup/swap.\n\nNote: Custom inventories suppress vanilla item handling by default. Mods must explicitly manage item movement in their click handlers.",
      fields: [
        {
          name: "player",
          type: "Player",
          description: "The player who clicked",
        },
        {
          name: "inventory",
          type: "CustomInventory",
          description: "The inventory that was clicked",
        },
        {
          name: "slot",
          type: "int",
          description: "The clicked slot index (-1 if outside the inventory)",
        },
        {
          name: "clickedItem",
          type: "ItemStack",
          description: "The item in the clicked slot at the time of the click",
        },
        {
          name: "action",
          type: "ClickAction",
          description: "The type of click performed",
        },
      ],
      subsections: [
        {
          id: "inventory-click-example",
          title: "Example",
          code: `AlloyAPI.eventBus().register(InventoryClickEvent.class, event -> {
    if (event.action() == ClickAction.LEFT && event.clickedItem() != null) {
        event.player().sendMessage("You clicked: " + event.clickedItem().type());
    }
    event.setCancelled(true); // Prevent item movement
});`,
          codeLang: "java",
        },
      ],
    },
    {
      id: "inventory-open-event",
      title: "InventoryOpenEvent",
      content:
        "Fired when a player opens a `CustomInventory`. Cancelling prevents the inventory from opening.",
      fields: [
        {
          name: "player",
          type: "Player",
          description: "The player opening the inventory",
        },
        {
          name: "inventory",
          type: "CustomInventory",
          description: "The inventory being opened",
        },
      ],
      subsections: [
        {
          id: "inventory-open-example",
          title: "Example",
          code: `AlloyAPI.eventBus().register(InventoryOpenEvent.class, event -> {
    if (!event.player().hasPermission("mymod.gui.use")) {
        event.player().sendMessage("You don't have permission to use this!");
        event.setCancelled(true);
    }
});`,
          codeLang: "java",
        },
      ],
    },
    {
      id: "inventory-close-event",
      title: "InventoryCloseEvent",
      content:
        "Fired when a player closes a `CustomInventory`. This event is **not cancellable** — use it for cleanup logic.",
      fields: [
        {
          name: "player",
          type: "Player",
          description: "The player who closed the inventory",
        },
        {
          name: "inventory",
          type: "CustomInventory",
          description: "The inventory that was closed",
        },
      ],
      subsections: [
        {
          id: "inventory-close-example",
          title: "Example",
          code: `AlloyAPI.eventBus().register(InventoryCloseEvent.class, event -> {
    // Save inventory contents when the player closes the GUI
    saveToDatabase(event.player().uniqueId(), event.inventory());
});`,
          codeLang: "java",
        },
      ],
    },
    {
      id: "inventory-drag-event",
      title: "InventoryDragEvent",
      content:
        "Fired when a player drags items across multiple slots in a `CustomInventory`. Cancelling prevents the drag operation.",
      fields: [
        {
          name: "player",
          type: "Player",
          description: "The player performing the drag",
        },
        {
          name: "inventory",
          type: "CustomInventory",
          description: "The inventory being dragged in",
        },
        {
          name: "slots",
          type: "Set<Integer>",
          description: "The set of slot indices involved in the drag",
        },
        {
          name: "cursor",
          type: "ItemStack",
          description: "The item being dragged (cursor item)",
        },
        {
          name: "dragType",
          type: "DragType",
          description: "EVEN (left-click drag) or SINGLE (right-click drag)",
        },
      ],
    },
    {
      id: "drag-type",
      title: "DragType",
      content: "The type of drag operation performed across inventory slots.",
      enumValues: [
        {
          name: "EVEN",
          description:
            "Items are distributed evenly across all dragged slots (left-click drag).",
        },
        {
          name: "SINGLE",
          description:
            "One item is placed in each dragged slot (right-click drag).",
        },
      ],
    },
    {
      id: "click-action",
      title: "ClickAction",
      content:
        "The type of click action performed in an inventory GUI. Maps to Minecraft's internal click types.",
      enumValues: [
        { name: "LEFT", description: "Left click" },
        { name: "RIGHT", description: "Right click" },
        { name: "SHIFT_LEFT", description: "Shift + left click (quick move)" },
        {
          name: "SHIFT_RIGHT",
          description: "Shift + right click (quick move)",
        },
        { name: "MIDDLE", description: "Middle click (clone in creative)" },
        { name: "DROP", description: "Drop key (Q) while hovering a slot" },
        {
          name: "CTRL_DROP",
          description: "Ctrl + drop (drop entire stack)",
        },
        { name: "NUMBER_KEY", description: "Number key (hotbar swap)" },
        {
          name: "DOUBLE_CLICK",
          description: "Double left click (collect all matching items)",
        },
      ],
    },
    {
      id: "menu-click-event",
      title: "MenuClickEvent",
      content:
        "Fired when a player clicks a slot in a `MenuLayout` GUI. Unlike InventoryClickEvent, this provides access to the `MenuInstance` and the typed `SlotDefinition`.\n\nUse this event for machine GUIs where slot types matter (INPUT, OUTPUT, FUEL, DISPLAY).",
      fields: [
        {
          name: "player",
          type: "Player",
          description: "The player who clicked",
        },
        {
          name: "menu",
          type: "MenuInstance",
          description: "The live menu instance",
        },
        {
          name: "slot",
          type: "SlotDefinition",
          description:
            "The slot definition that was clicked, or null if outside defined slots",
        },
        {
          name: "clickedItem",
          type: "ItemStack",
          description: "The item in the clicked slot",
        },
        {
          name: "action",
          type: "ClickAction",
          description: "The type of click performed",
        },
      ],
      subsections: [
        {
          id: "menu-click-example",
          title: "Example",
          code: `AlloyAPI.eventBus().register(MenuClickEvent.class, event -> {
    SlotDefinition slot = event.slot();
    if (slot == null) return;

    switch (slot.type()) {
        case OUTPUT -> {
            // Give the output item to the player
            ItemStack item = event.clickedItem();
            if (item != null && !item.isEmpty()) {
                event.player().inventory().addItem(item);
                event.menu().setItem(slot.index(), null);
            }
        }
        case DISPLAY -> {
            // DISPLAY slots are never interactive — nothing to do
        }
        case INPUT, FUEL, NORMAL -> {
            // Handle insertion logic
            ItemStack held = event.player().itemInMainHand();
            if (held != null && slot.accepts(held)) {
                event.menu().setItem(slot.index(), held.copy());
            }
        }
    }
});`,
          codeLang: "java",
        },
      ],
    },
  ],
};
