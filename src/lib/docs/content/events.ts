import type { DocPage } from "../types";

export const eventsDoc: DocPage = {
  slug: "events",
  title: "Event System",
  description: "How to listen for and respond to game events using the Alloy event bus.",
  category: "api",
  order: 1,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "The event system is the primary way mods interact with the game. When something happens — a player joins, a block breaks, an entity spawns — the server fires an event through the `EventBus`. Your mod registers listener classes that receive these events and respond to them.\n\nAll events extend the base `Event` class. Many events implement `Cancellable`, which lets you prevent the action from occurring.",
    },
    {
      id: "registering-listeners",
      title: "Registering Listeners",
      content:
        "A listener is any class that implements the `Listener` marker interface. Methods annotated with `@EventHandler` will automatically be called when the matching event fires.",
      code: `import net.alloymc.api.event.Listener;
import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.player.PlayerJoinEvent;

public class MyListener implements Listener {

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        event.player().sendMessage("Welcome!");
    }
}

// In your onInitialize():
AlloyAPI.eventBus().register(new MyListener());`,
      codeLang: "java",
    },
    {
      id: "event-handler-annotation",
      title: "@EventHandler",
      content: "The `@EventHandler` annotation marks a method as an event listener. It accepts two optional parameters:",
      fields: [
        {
          name: "priority",
          type: "EventPriority",
          description: "The execution priority of this handler. Handlers run from LOWEST to HIGHEST, then MONITOR.",
          defaultValue: "NORMAL",
        },
        {
          name: "ignoreCancelled",
          type: "boolean",
          description: "If true, this handler won't be called if the event was already cancelled by a higher-priority handler.",
          defaultValue: "false",
        },
      ],
      subsections: [
        {
          id: "priority-example",
          title: "Priority Example",
          code: `@EventHandler(priority = EventPriority.HIGH, ignoreCancelled = true)
public void onBlockBreak(BlockBreakEvent event) {
    // Only runs if no earlier handler cancelled this event
}`,
          codeLang: "java",
        },
      ],
    },
    {
      id: "event-priority",
      title: "EventPriority",
      content: "Controls the order in which handlers execute. Lower priorities run first.",
      enumValues: [
        { name: "LOWEST", description: "Runs first. Use for setup or early filtering." },
        { name: "LOW", description: "Runs after LOWEST." },
        { name: "NORMAL", description: "Default priority. Most handlers should use this." },
        { name: "HIGH", description: "Runs after NORMAL. Use for overrides." },
        { name: "HIGHEST", description: "Runs last before MONITOR. Use for final say on cancellation." },
        { name: "MONITOR", description: "Runs last. Read-only — do not modify or cancel events here." },
      ],
    },
    {
      id: "cancellable",
      title: "Cancellable Events",
      content:
        "Events that implement `Cancellable` can be prevented from occurring. Call `setCancelled(true)` to cancel the action. For example, cancelling a `BlockBreakEvent` prevents the block from being broken.",
      methods: [
        {
          signature: "event.isCancelled(): boolean",
          description: "Returns whether this event has been cancelled.",
          returns: { type: "boolean", description: "True if cancelled" },
        },
        {
          signature: "event.setCancelled(boolean cancelled): void",
          description: "Sets the cancellation state of this event.",
          params: [{ name: "cancelled", type: "boolean", description: "True to cancel, false to un-cancel" }],
        },
      ],
    },
    {
      id: "event-bus",
      title: "EventBus",
      content: "The central event dispatcher. All listener registration and event firing goes through here.",
      methods: [
        {
          signature: "eventBus.register(Listener listener): void",
          description: "Registers all @EventHandler methods in the given listener class.",
          params: [{ name: "listener", type: "Listener", description: "The listener instance to register" }],
        },
        {
          signature: "eventBus.unregister(Listener listener): void",
          description: "Removes all handlers from the given listener.",
          params: [{ name: "listener", type: "Listener", description: "The listener to unregister" }],
        },
        {
          signature: "eventBus.fire(T event): T",
          description: "Fires an event to all registered handlers and returns it. Useful for checking cancellation state after firing.",
          params: [{ name: "event", type: "T extends Event", description: "The event to fire" }],
          returns: { type: "T", description: "The same event instance (potentially modified by handlers)" },
        },
      ],
    },
    {
      id: "async-events",
      title: "Async Events",
      content:
        "Some events fire asynchronously (on a thread other than the main server thread). `PlayerChatEvent` is one example. When handling async events, do **not** call any Alloy API methods that modify game state — those must run on the main thread.\n\nUse `AlloyAPI.scheduler().runTask()` to schedule main-thread work from an async handler.",
    },
    {
      id: "event-categories",
      title: "Event Categories",
      content:
        "Alloy provides 42+ event classes across three main categories:\n\n**Block Events** — Triggered by block changes: breaking, placing, igniting, piston movement, explosions, and more.\n\n**Entity Events** — Triggered by entity actions: damage, death, spawning, targeting, explosions, and interactions.\n\n**Player Events** — Triggered by player actions: joining, chatting, moving, interacting, dying, and item management.\n\nSee the dedicated pages for each category for full details.",
    },
  ],
};
