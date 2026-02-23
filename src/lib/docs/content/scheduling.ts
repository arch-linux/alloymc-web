import type { DocPage } from "../types";

export const schedulingDoc: DocPage = {
  slug: "scheduling",
  title: "Scheduling",
  description: "Run tasks on the main thread or asynchronously with delays and repeating intervals.",
  category: "systems",
  order: 2,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "The scheduler lets you run code after a delay, on a repeating interval, or asynchronously on a separate thread pool. All time values are in **ticks** (20 ticks = 1 second).\n\n**Synchronous tasks** run on the main server thread and can safely call any Alloy API method.\n\n**Asynchronous tasks** run on a separate thread pool — ideal for I/O, HTTP requests, and database queries. Do not call game-modifying API methods from async tasks; use `runTask()` to schedule follow-up work on the main thread.",
    },
    {
      id: "scheduler",
      title: "Scheduler",
      content: "Access the scheduler via `AlloyAPI.scheduler()`.",
      methods: [
        {
          signature: "scheduler.runTask(Runnable task): ScheduledTask",
          description: "Runs a task on the main thread on the next tick.",
          params: [{ name: "task", type: "Runnable", description: "The task to run" }],
          returns: { type: "ScheduledTask", description: "Handle to cancel the task" },
        },
        {
          signature: "scheduler.runTaskLater(Runnable task, long delayTicks): ScheduledTask",
          description: "Runs a task on the main thread after a delay.",
          params: [
            { name: "task", type: "Runnable", description: "The task to run" },
            { name: "delayTicks", type: "long", description: "Delay in ticks before execution" },
          ],
          returns: { type: "ScheduledTask", description: "Handle to cancel the task" },
          example: `// Send a message after 5 seconds
AlloyAPI.scheduler().runTaskLater(() -> {
    player.sendMessage("5 seconds have passed!");
}, 100);`,
        },
        {
          signature: "scheduler.runTaskTimer(Runnable task, long delayTicks, long periodTicks): ScheduledTask",
          description: "Runs a repeating task on the main thread.",
          params: [
            { name: "task", type: "Runnable", description: "The task to run each period" },
            { name: "delayTicks", type: "long", description: "Delay before the first execution" },
            { name: "periodTicks", type: "long", description: "Interval between executions" },
          ],
          returns: { type: "ScheduledTask", description: "Handle to cancel the task" },
          example: `// Broadcast every 60 seconds, starting immediately
ScheduledTask task = AlloyAPI.scheduler().runTaskTimer(() -> {
    AlloyAPI.server().broadcast("Server reminder!");
}, 0, 1200);

// Stop it later
task.cancel();`,
        },
        {
          signature: "scheduler.runAsync(Runnable task): ScheduledTask",
          description: "Runs a task asynchronously on a separate thread pool. Safe for I/O and computation.",
          params: [{ name: "task", type: "Runnable", description: "The task to run" }],
          returns: { type: "ScheduledTask", description: "Handle to cancel the task" },
        },
        {
          signature: "scheduler.runAsyncLater(Runnable task, long delayTicks): ScheduledTask",
          description: "Runs a task asynchronously after a delay.",
          params: [
            { name: "task", type: "Runnable", description: "The task to run" },
            { name: "delayTicks", type: "long", description: "Delay in ticks" },
          ],
          returns: { type: "ScheduledTask", description: "Handle to cancel the task" },
        },
        {
          signature: "scheduler.runAsyncTimer(Runnable task, long delayTicks, long periodTicks): ScheduledTask",
          description: "Runs a repeating task asynchronously.",
          params: [
            { name: "task", type: "Runnable", description: "The task to run each period" },
            { name: "delayTicks", type: "long", description: "Delay before first execution" },
            { name: "periodTicks", type: "long", description: "Interval between executions" },
          ],
          returns: { type: "ScheduledTask", description: "Handle to cancel the task" },
        },
      ],
    },
    {
      id: "scheduled-task",
      title: "ScheduledTask",
      content: "A handle returned by all scheduling methods. Use it to cancel a running or pending task.",
      methods: [
        {
          signature: "task.cancel(): void",
          description: "Cancels the task. For repeating tasks, stops future executions. Has no effect if already cancelled.",
        },
        {
          signature: "task.isCancelled(): boolean",
          description: "Whether this task has been cancelled.",
          returns: { type: "boolean", description: "True if cancelled" },
        },
      ],
    },
    {
      id: "tick-reference",
      title: "Tick Reference",
      content: "Quick reference for converting real time to ticks:",
      fields: [
        { name: "1 tick", type: "50ms", description: "Base game tick" },
        { name: "20 ticks", type: "1 second", description: "Standard conversion" },
        { name: "1,200 ticks", type: "1 minute", description: "" },
        { name: "24,000 ticks", type: "20 minutes", description: "One full Minecraft day/night cycle" },
      ],
    },
    {
      id: "patterns",
      title: "Common Patterns",
      content: "Async I/O with main-thread follow-up:",
      code: `// Fetch data from an external API, then update the game
AlloyAPI.scheduler().runAsync(() -> {
    // This runs on a background thread — safe for I/O
    String result = fetchFromExternalApi(player.uniqueId());

    // Switch back to the main thread to modify game state
    AlloyAPI.scheduler().runTask(() -> {
        player.sendMessage("API says: " + result);
    });
});`,
      codeLang: "java",
      subsections: [
        {
          id: "countdown-pattern",
          title: "Countdown Timer",
          code: `// Countdown from 10
final int[] count = {10};
ScheduledTask countdown = AlloyAPI.scheduler().runTaskTimer(() -> {
    if (count[0] <= 0) {
        AlloyAPI.server().broadcast("Go!");
        // Can't cancel self easily — use a stored reference
        return;
    }
    AlloyAPI.server().broadcast(count[0] + "...");
    count[0]--;
}, 0, 20); // Every second

// Cancel after 11 seconds
AlloyAPI.scheduler().runTaskLater(countdown::cancel, 220);`,
          codeLang: "java",
        },
      ],
    },
  ],
};
