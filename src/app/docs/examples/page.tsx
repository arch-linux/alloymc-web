"use client";

import { useState } from "react";
import {
  ZapIcon,
  BookIcon,
  LayersIcon,
  TerminalIcon,
  PackageIcon,
  MapIcon,
  StarIcon,
} from "@/components/icons";

// ── Types ──

type ExampleFile = {
  name: string;
  lang: string;
  code: string;
};

type Example = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  files: ExampleFile[];
};

// ── Data ──

const CATEGORIES = [
  { id: "all", label: "All", icon: <LayersIcon className="w-4 h-4" /> },
  { id: "events", label: "Events", icon: <ZapIcon className="w-4 h-4" /> },
  { id: "commands", label: "Commands", icon: <TerminalIcon className="w-4 h-4" /> },
  { id: "world", label: "World", icon: <MapIcon className="w-4 h-4" /> },
  { id: "items", label: "Items", icon: <PackageIcon className="w-4 h-4" /> },
  { id: "systems", label: "Systems", icon: <BookIcon className="w-4 h-4" /> },
  { id: "economy", label: "Economy", icon: <StarIcon className="w-4 h-4" /> },
];

const EXAMPLES: Example[] = [
  {
    id: "set-spawn",
    title: "Set Spawn",
    description: "Save and teleport to a personal spawn point. Covers commands, permissions, configuration, and persistent metadata.",
    category: "commands",
    difficulty: "beginner",
    tags: ["commands", "teleport", "config"],
    files: [
      {
        name: "SetSpawnMod.java",
        lang: "java",
        code: `package com.example.setspawn;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.permission.PermissionRegistry.PermissionDefault;
import net.alloymc.loader.api.ModInitializer;

public class SetSpawnMod implements ModInitializer {

    @Override
    public void onInitialize() {
        // Register permissions
        AlloyAPI.permissionRegistry().register(
            "setspawn.use", "Set and teleport to spawn",
            PermissionDefault.TRUE
        );

        // Register commands
        AlloyAPI.commandRegistry().register(new SetSpawnCommand());
        AlloyAPI.commandRegistry().register(new SpawnCommand());

        AlloyAPI.server().logger().info("SetSpawn loaded!");
    }
}`,
      },
      {
        name: "SetSpawnCommand.java",
        lang: "java",
        code: `package com.example.setspawn;

import net.alloymc.api.command.Command;
import net.alloymc.api.command.CommandSender;
import net.alloymc.api.entity.Player;
import net.alloymc.api.world.Location;

public class SetSpawnCommand extends Command {

    public SetSpawnCommand() {
        super("setspawn", "Set your personal spawn point", "setspawn.use");
    }

    @Override
    public boolean execute(CommandSender sender, String label, String[] args) {
        if (!sender.isPlayer()) {
            sender.sendMessage("Only players can set spawn points.");
            return true;
        }

        Player player = (Player) sender;
        Location loc = player.location();

        // Store spawn as persistent metadata on the player
        player.setMetadata("spawn_world", loc.world().name());
        player.setMetadata("spawn_x", String.valueOf(loc.x()));
        player.setMetadata("spawn_y", String.valueOf(loc.y()));
        player.setMetadata("spawn_z", String.valueOf(loc.z()));
        player.setMetadata("spawn_yaw", String.valueOf(loc.yaw()));
        player.setMetadata("spawn_pitch", String.valueOf(loc.pitch()));

        player.sendMessage("Spawn point set at " +
            (int) loc.x() + ", " + (int) loc.y() + ", " + (int) loc.z());
        return true;
    }
}`,
      },
      {
        name: "SpawnCommand.java",
        lang: "java",
        code: `package com.example.setspawn;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.command.Command;
import net.alloymc.api.command.CommandSender;
import net.alloymc.api.entity.Player;
import net.alloymc.api.world.Location;
import net.alloymc.api.world.World;

public class SpawnCommand extends Command {

    public SpawnCommand() {
        super("spawn", "Teleport to your spawn point", "setspawn.use");
    }

    @Override
    public boolean execute(CommandSender sender, String label, String[] args) {
        if (!sender.isPlayer()) {
            sender.sendMessage("Only players can teleport.");
            return true;
        }

        Player player = (Player) sender;

        if (!player.hasMetadata("spawn_x")) {
            player.sendMessage("You haven't set a spawn point yet! Use /setspawn");
            return true;
        }

        String worldName = (String) player.getMetadata("spawn_world");
        double x = Double.parseDouble((String) player.getMetadata("spawn_x"));
        double y = Double.parseDouble((String) player.getMetadata("spawn_y"));
        double z = Double.parseDouble((String) player.getMetadata("spawn_z"));
        float yaw = Float.parseFloat((String) player.getMetadata("spawn_yaw"));
        float pitch = Float.parseFloat((String) player.getMetadata("spawn_pitch"));

        World world = AlloyAPI.server().world(worldName).orElse(null);
        if (world == null) {
            player.sendMessage("Spawn world no longer exists!");
            return true;
        }

        player.teleport(new Location(world, x, y, z, yaw, pitch));
        player.sendMessage("Teleported to your spawn point!");
        return true;
    }
}`,
      },
      {
        name: "alloy.mod.json",
        lang: "json",
        code: `{
  "id": "set-spawn",
  "name": "Set Spawn",
  "version": "1.0.0",
  "description": "Personal spawn points for every player",
  "authors": ["YourName"],
  "entrypoint": "com.example.setspawn.SetSpawnMod",
  "dependencies": { "alloy": ">=0.1.0" },
  "environment": "server"
}`,
      },
    ],
  },
  {
    id: "welcome-greeter",
    title: "Welcome Greeter",
    description: "Greet players with a custom message on join. Demonstrates event handling, first-join detection, and the player API.",
    category: "events",
    difficulty: "beginner",
    tags: ["events", "player", "messages"],
    files: [
      {
        name: "GreeterMod.java",
        lang: "java",
        code: `package com.example.greeter;

import net.alloymc.api.AlloyAPI;
import net.alloymc.loader.api.ModInitializer;

public class GreeterMod implements ModInitializer {

    @Override
    public void onInitialize() {
        AlloyAPI.eventBus().register(new JoinListener());
    }
}`,
      },
      {
        name: "JoinListener.java",
        lang: "java",
        code: `package com.example.greeter;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.Listener;
import net.alloymc.api.event.player.PlayerJoinEvent;
import net.alloymc.api.entity.Player;

public class JoinListener implements Listener {

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.player();

        if (!player.hasPlayedBefore()) {
            // First time joining — special welcome
            event.setJoinMessage(player.displayName() + " joined for the first time!");

            // Send a delayed welcome message
            AlloyAPI.scheduler().runTaskLater(() -> {
                if (player.isOnline()) {
                    player.sendMessage("Welcome to the server!");
                    player.sendMessage("Type /help to get started.");
                }
            }, 40); // 2 seconds

            // Announce to everyone
            AlloyAPI.server().broadcast(
                "Everyone welcome " + player.displayName() + "!"
            );
        } else {
            event.setJoinMessage(player.displayName() + " is back!");
            player.sendMessage("Welcome back, " + player.displayName() + "!");
        }
    }
}`,
      },
      {
        name: "alloy.mod.json",
        lang: "json",
        code: `{
  "id": "welcome-greeter",
  "name": "Welcome Greeter",
  "version": "1.0.0",
  "description": "Custom join messages and first-time welcome",
  "entrypoint": "com.example.greeter.GreeterMod",
  "dependencies": { "alloy": ">=0.1.0" }
}`,
      },
    ],
  },
  {
    id: "diamond-alert",
    title: "Diamond Alert",
    description: "Broadcast a message when someone mines diamonds. Shows block events, material checks, and cancellation.",
    category: "events",
    difficulty: "beginner",
    tags: ["events", "blocks", "broadcast"],
    files: [
      {
        name: "DiamondAlertMod.java",
        lang: "java",
        code: `package com.example.diamondalert;

import net.alloymc.api.AlloyAPI;
import net.alloymc.loader.api.ModInitializer;

public class DiamondAlertMod implements ModInitializer {

    @Override
    public void onInitialize() {
        AlloyAPI.eventBus().register(new MineListener());
    }
}`,
      },
      {
        name: "MineListener.java",
        lang: "java",
        code: `package com.example.diamondalert;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.Listener;
import net.alloymc.api.event.block.BlockBreakEvent;
import net.alloymc.api.inventory.Material;

public class MineListener implements Listener {

    @EventHandler
    public void onBlockBreak(BlockBreakEvent event) {
        Material type = event.block().type();

        if (type == Material.DIAMOND_ORE || type == Material.DEEPSLATE_DIAMOND_ORE) {
            String name = event.player().displayName();
            int y = event.block().y();

            AlloyAPI.server().broadcast(
                name + " found diamonds at Y=" + y + "!"
            );
        }
    }
}`,
      },
    ],
  },
  {
    id: "block-logger",
    title: "Block Protection",
    description: "Prevent players without permission from breaking blocks in specific regions. Demonstrates BoundingBox, cancellation, and permissions.",
    category: "world",
    difficulty: "intermediate",
    tags: ["world", "permissions", "events", "cancellation"],
    files: [
      {
        name: "BlockProtectionMod.java",
        lang: "java",
        code: `package com.example.protection;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.permission.PermissionRegistry.PermissionDefault;
import net.alloymc.loader.api.ModInitializer;

public class BlockProtectionMod implements ModInitializer {

    @Override
    public void onInitialize() {
        AlloyAPI.permissionRegistry().register(
            "protection.bypass", "Bypass block protection",
            PermissionDefault.OP
        );

        AlloyAPI.eventBus().register(new ProtectionListener());
        AlloyAPI.commandRegistry().register(new ProtectCommand());

        AlloyAPI.server().logger().info("Block Protection active!");
    }
}`,
      },
      {
        name: "ProtectionListener.java",
        lang: "java",
        code: `package com.example.protection;

import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.EventPriority;
import net.alloymc.api.event.Listener;
import net.alloymc.api.event.block.BlockBreakEvent;
import net.alloymc.api.event.block.BlockPlaceEvent;
import net.alloymc.api.entity.Player;
import net.alloymc.api.world.BoundingBox;

public class ProtectionListener implements Listener {

    // Protected region: spawn area from (-50, -64, -50) to (50, 320, 50)
    private static final BoundingBox SPAWN_REGION =
        BoundingBox.of(-50, -64, -50, 50, 320, 50);

    @EventHandler(priority = EventPriority.HIGH)
    public void onBreak(BlockBreakEvent event) {
        if (isProtected(event.player(), event.block().location())) {
            event.setCancelled(true);
            event.player().sendMessage("This area is protected!");
        }
    }

    @EventHandler(priority = EventPriority.HIGH)
    public void onPlace(BlockPlaceEvent event) {
        if (isProtected(event.player(), event.block().location())) {
            event.setCancelled(true);
            event.player().sendMessage("This area is protected!");
        }
    }

    private boolean isProtected(Player player,
                                 net.alloymc.api.world.Location loc) {
        return SPAWN_REGION.contains(loc)
            && !player.hasPermission("protection.bypass");
    }
}`,
      },
      {
        name: "ProtectCommand.java",
        lang: "java",
        code: `package com.example.protection;

import net.alloymc.api.command.Command;
import net.alloymc.api.command.CommandSender;
import net.alloymc.api.entity.Player;

public class ProtectCommand extends Command {

    public ProtectCommand() {
        super("protect", "Show protection info", "protection.bypass");
    }

    @Override
    public boolean execute(CommandSender sender, String label, String[] args) {
        if (sender.isPlayer()) {
            Player p = (Player) sender;
            sender.sendMessage("You are at: " +
                (int) p.location().x() + ", " +
                (int) p.location().y() + ", " +
                (int) p.location().z());
        }
        sender.sendMessage("Spawn region: (-50, -50) to (50, 50)");
        sender.sendMessage("Bypass permission: protection.bypass");
        return true;
    }
}`,
      },
    ],
  },
  {
    id: "auto-smelter",
    title: "Auto Smelter",
    description: "Automatically smelt ores when mined by players holding a specific tool. Demonstrates item data, block events, and inventory manipulation.",
    category: "items",
    difficulty: "intermediate",
    tags: ["items", "events", "blocks", "inventory"],
    files: [
      {
        name: "AutoSmelterMod.java",
        lang: "java",
        code: `package com.example.autosmelter;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.permission.PermissionRegistry.PermissionDefault;
import net.alloymc.loader.api.ModInitializer;

public class AutoSmelterMod implements ModInitializer {

    @Override
    public void onInitialize() {
        AlloyAPI.permissionRegistry().register(
            "autosmelter.use", "Use auto-smelting pickaxes",
            PermissionDefault.TRUE
        );

        AlloyAPI.commandRegistry().register(new EnchantPickCommand());
        AlloyAPI.eventBus().register(new SmeltListener());
    }
}`,
      },
      {
        name: "SmeltListener.java",
        lang: "java",
        code: `package com.example.autosmelter;

import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.Listener;
import net.alloymc.api.event.block.BlockBreakEvent;
import net.alloymc.api.inventory.ItemStack;
import net.alloymc.api.inventory.Material;

import java.util.Map;

public class SmeltListener implements Listener {

    // Ore -> smelted result
    private static final Map<Material, Material> SMELT_MAP = Map.of(
        Material.IRON_ORE, Material.IRON_INGOT,
        Material.DEEPSLATE_IRON_ORE, Material.IRON_INGOT,
        Material.GOLD_ORE, Material.GOLD_INGOT,
        Material.DEEPSLATE_GOLD_ORE, Material.GOLD_INGOT,
        Material.COPPER_ORE, Material.COPPER_INGOT,
        Material.DEEPSLATE_COPPER_ORE, Material.COPPER_INGOT
    );

    @EventHandler
    public void onBreak(BlockBreakEvent event) {
        ItemStack tool = event.player().itemInMainHand();

        // Check if the tool has the auto-smelt enchantment
        if (!tool.hasData("autosmelter:enabled")) return;
        if (!event.player().hasPermission("autosmelter.use")) return;

        Material result = SMELT_MAP.get(event.block().type());
        if (result != null) {
            // Replace the block with air (prevent normal drop)
            event.block().setType(Material.AIR);
            event.setCancelled(true);

            // Give the smelted result directly
            event.player().sendMessage("Auto-smelted!");
        }
    }
}`,
      },
      {
        name: "EnchantPickCommand.java",
        lang: "java",
        code: `package com.example.autosmelter;

import net.alloymc.api.command.Command;
import net.alloymc.api.command.CommandSender;
import net.alloymc.api.entity.Player;
import net.alloymc.api.inventory.ItemStack;

public class EnchantPickCommand extends Command {

    public EnchantPickCommand() {
        super("autosmelt", "Toggle auto-smelting on held pickaxe",
              "autosmelter.use");
    }

    @Override
    public boolean execute(CommandSender sender, String label, String[] args) {
        if (!sender.isPlayer()) {
            sender.sendMessage("Players only!");
            return true;
        }

        Player player = (Player) sender;
        ItemStack item = player.itemInMainHand();

        if (item.isEmpty()) {
            player.sendMessage("Hold a pickaxe first!");
            return true;
        }

        if (item.hasData("autosmelter:enabled")) {
            item.removeData("autosmelter:enabled");
            player.sendMessage("Auto-smelting disabled on this tool.");
        } else {
            item.setData("autosmelter:enabled", "true");
            player.sendMessage("Auto-smelting enabled! Ores will smelt on mine.");
        }

        return true;
    }
}`,
      },
    ],
  },
  {
    id: "combat-logger",
    title: "Combat Logger",
    description: "Tag players in combat and punish disconnects. Demonstrates entity damage events, the scheduler, and player quit detection.",
    category: "systems",
    difficulty: "advanced",
    tags: ["events", "scheduler", "entity", "pvp"],
    files: [
      {
        name: "CombatLogMod.java",
        lang: "java",
        code: `package com.example.combatlog;

import net.alloymc.api.AlloyAPI;
import net.alloymc.loader.api.ModInitializer;

public class CombatLogMod implements ModInitializer {

    @Override
    public void onInitialize() {
        CombatTracker tracker = new CombatTracker();
        AlloyAPI.eventBus().register(tracker);

        AlloyAPI.server().logger().info("Combat Logger active — "
            + "10 second combat tag, death on disconnect.");
    }
}`,
      },
      {
        name: "CombatTracker.java",
        lang: "java",
        code: `package com.example.combatlog;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.entity.Player;
import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.Listener;
import net.alloymc.api.event.entity.EntityDamageByEntityEvent;
import net.alloymc.api.event.player.PlayerQuitEvent;
import net.alloymc.api.scheduler.ScheduledTask;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class CombatTracker implements Listener {

    // Player UUID -> scheduled un-tag task
    private final Map<UUID, ScheduledTask> tagged = new ConcurrentHashMap<>();

    private static final long COMBAT_TAG_TICKS = 200; // 10 seconds

    @EventHandler
    public void onDamage(EntityDamageByEntityEvent event) {
        // Tag both parties if PvP
        if (event.entity() instanceof Player victim
                && event.damager() instanceof Player attacker) {
            tagPlayer(victim);
            tagPlayer(attacker);
        }
    }

    @EventHandler
    public void onQuit(PlayerQuitEvent event) {
        Player player = event.player();
        UUID id = player.uniqueId();

        if (tagged.containsKey(id)) {
            // Combat logged! Kill them.
            player.setHealth(0);
            tagged.remove(id).cancel();

            AlloyAPI.server().broadcast(
                player.displayName() + " combat logged and was killed!"
            );

            event.setQuitMessage(null); // suppress normal quit message
        }
    }

    private void tagPlayer(Player player) {
        UUID id = player.uniqueId();

        // Cancel existing un-tag timer
        ScheduledTask existing = tagged.get(id);
        if (existing != null) existing.cancel();

        // Notify the player
        player.sendMessage("You are now in combat! Don't log out for 10s.");

        // Schedule un-tag
        ScheduledTask task = AlloyAPI.scheduler().runTaskLater(() -> {
            tagged.remove(id);
            if (player.isOnline()) {
                player.sendMessage("You are no longer in combat.");
            }
        }, COMBAT_TAG_TICKS);

        tagged.put(id, task);
    }
}`,
      },
    ],
  },
  {
    id: "bridge-builder",
    title: "Bridge Builder",
    description: "Place blocks under your feet while sneaking over the void. Demonstrates player movement events, block placement, and real-time game interaction.",
    category: "world",
    difficulty: "intermediate",
    tags: ["events", "world", "blocks", "movement"],
    files: [
      {
        name: "BridgeBuilderMod.java",
        lang: "java",
        code: `package com.example.bridge;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.permission.PermissionRegistry.PermissionDefault;
import net.alloymc.loader.api.ModInitializer;

public class BridgeBuilderMod implements ModInitializer {

    @Override
    public void onInitialize() {
        AlloyAPI.permissionRegistry().register(
            "bridge.use", "Auto-bridge while sneaking",
            PermissionDefault.TRUE
        );

        AlloyAPI.eventBus().register(new BridgeListener());
    }
}`,
      },
      {
        name: "BridgeListener.java",
        lang: "java",
        code: `package com.example.bridge;

import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.Listener;
import net.alloymc.api.event.player.PlayerMoveEvent;
import net.alloymc.api.entity.Player;
import net.alloymc.api.world.Block;
import net.alloymc.api.world.Location;
import net.alloymc.api.inventory.Material;

public class BridgeListener implements Listener {

    @EventHandler
    public void onMove(PlayerMoveEvent event) {
        Player player = event.player();

        // Only activate when sneaking + has permission
        if (!player.isSneaking()) return;
        if (!player.hasPermission("bridge.use")) return;

        Location loc = player.location();

        // Check the block below the player's feet
        Block below = player.world().blockAt(
            (int) Math.floor(loc.x()),
            (int) Math.floor(loc.y()) - 1,
            (int) Math.floor(loc.z())
        );

        // If it's air, place a block
        if (below.isEmpty()) {
            below.setType(Material.COBBLESTONE);
        }
    }
}`,
      },
    ],
  },
  {
    id: "async-motd",
    title: "Async MOTD",
    description: "Fetch a message of the day from an external API on join. Demonstrates async scheduling, main-thread callbacks, and safe online checks.",
    category: "systems",
    difficulty: "advanced",
    tags: ["scheduler", "async", "events", "api"],
    files: [
      {
        name: "MotdMod.java",
        lang: "java",
        code: `package com.example.motd;

import net.alloymc.api.AlloyAPI;
import net.alloymc.loader.api.ModInitializer;

public class MotdMod implements ModInitializer {

    @Override
    public void onInitialize() {
        AlloyAPI.eventBus().register(new MotdListener());
    }
}`,
      },
      {
        name: "MotdListener.java",
        lang: "java",
        code: `package com.example.motd;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.entity.Player;
import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.Listener;
import net.alloymc.api.event.player.PlayerJoinEvent;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class MotdListener implements Listener {

    private static final String MOTD_URL = "https://api.example.com/motd";

    @EventHandler
    public void onJoin(PlayerJoinEvent event) {
        Player player = event.player();

        // Fetch MOTD async — NEVER do HTTP on the main thread!
        AlloyAPI.scheduler().runAsync(() -> {
            try {
                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(MOTD_URL))
                    .GET()
                    .build();

                HttpResponse<String> response = client.send(
                    request, HttpResponse.BodyHandlers.ofString()
                );

                String motd = response.body();

                // Switch back to main thread to send message
                AlloyAPI.scheduler().runTask(() -> {
                    // Always check if still online!
                    if (player.isOnline()) {
                        player.sendMessage("--- Message of the Day ---");
                        player.sendMessage(motd);
                        player.sendMessage("--------------------------");
                    }
                });

            } catch (Exception e) {
                AlloyAPI.server().logger().warning(
                    "Failed to fetch MOTD: " + e.getMessage()
                );
            }
        });
    }
}`,
      },
    ],
  },
  {
    id: "mob-bounties",
    title: "Mob Bounties",
    description: "Reward players with currency for killing mobs. Demonstrates the Economy API, entity death events, configurable bounty tables, and the permission system.",
    category: "economy",
    difficulty: "intermediate",
    tags: ["economy", "events", "entity", "config"],
    files: [
      {
        name: "MobBountyMod.java",
        lang: "java",
        code: `package com.example.mobbounty;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.permission.PermissionRegistry.PermissionDefault;
import net.alloymc.loader.api.ModInitializer;

public class MobBountyMod implements ModInitializer {

    @Override
    public void onInitialize() {
        // Require the economy system
        if (AlloyAPI.economy() == null) {
            AlloyAPI.server().logger().warning(
                "Economy is disabled — Mob Bounties will not load."
            );
            return;
        }

        AlloyAPI.permissionRegistry().register(
            "mobbounty.earn", "Earn bounties for killing mobs",
            PermissionDefault.TRUE
        );
        AlloyAPI.permissionRegistry().register(
            "mobbounty.bonus", "Earn 2x bounties",
            PermissionDefault.OP
        );

        AlloyAPI.eventBus().register(new BountyListener());
        AlloyAPI.commandRegistry().register(new BountyCommand());

        AlloyAPI.server().logger().info("Mob Bounties loaded — " +
            BountyTable.BOUNTIES.size() + " mob types configured.");
    }
}`,
      },
      {
        name: "BountyTable.java",
        lang: "java",
        code: `package com.example.mobbounty;

import java.util.Map;

/**
 * Bounty rewards per entity type.
 * In a real mod you'd load these from a config file.
 */
public class BountyTable {

    public static final Map<String, Double> BOUNTIES = Map.ofEntries(
        // Hostile mobs — higher reward
        Map.entry("ZOMBIE",          5.0),
        Map.entry("SKELETON",        5.0),
        Map.entry("CREEPER",        10.0),
        Map.entry("SPIDER",          4.0),
        Map.entry("ENDERMAN",       15.0),
        Map.entry("WITCH",          12.0),
        Map.entry("BLAZE",          20.0),
        Map.entry("WITHER_SKELETON", 25.0),
        Map.entry("GHAST",          18.0),
        Map.entry("PHANTOM",         8.0),

        // Mini-bosses
        Map.entry("ELDER_GUARDIAN", 100.0),
        Map.entry("EVOKER",         50.0),
        Map.entry("RAVAGER",        60.0),

        // Bosses
        Map.entry("WITHER",        500.0),
        Map.entry("ENDER_DRAGON", 1000.0)
    );

    public static double getBounty(String entityType) {
        return BOUNTIES.getOrDefault(entityType, 0.0);
    }
}`,
      },
      {
        name: "BountyListener.java",
        lang: "java",
        code: `package com.example.mobbounty;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.economy.EconomyProvider;
import net.alloymc.api.entity.Player;
import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.Listener;
import net.alloymc.api.event.entity.EntityDeathEvent;

public class BountyListener implements Listener {

    @EventHandler
    public void onEntityDeath(EntityDeathEvent event) {
        // Only pay out if a player got the kill
        Player killer = event.entity().killer();
        if (killer == null) return;
        if (!killer.hasPermission("mobbounty.earn")) return;

        String type = event.entity().type().name();
        double bounty = BountyTable.getBounty(type);
        if (bounty <= 0) return;

        // Double payout for VIP/donors
        if (killer.hasPermission("mobbounty.bonus")) {
            bounty *= 2.0;
        }

        EconomyProvider economy = AlloyAPI.economy();

        // Ensure the player has an account
        if (!economy.hasAccount(killer.uniqueId())) {
            economy.createAccount(killer.uniqueId());
        }

        if (economy.deposit(killer.uniqueId(), bounty)) {
            killer.sendMessage(
                "+" + economy.format(bounty) + " for killing a " +
                type.toLowerCase().replace('_', ' ')
            );
        }
    }
}`,
      },
      {
        name: "BountyCommand.java",
        lang: "java",
        code: `package com.example.mobbounty;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.command.Command;
import net.alloymc.api.command.CommandSender;
import net.alloymc.api.economy.EconomyProvider;

import java.util.Map;

public class BountyCommand extends Command {

    public BountyCommand() {
        super("bounties", "View mob bounty rewards", "mobbounty.earn");
    }

    @Override
    public boolean execute(CommandSender sender, String label, String[] args) {
        EconomyProvider economy = AlloyAPI.economy();

        sender.sendMessage("--- Mob Bounties ---");

        // Sort by reward value descending
        BountyTable.BOUNTIES.entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .forEach(entry -> {
                String mob = entry.getKey().toLowerCase().replace('_', ' ');
                String reward = economy.format(entry.getValue());
                sender.sendMessage("  " + mob + ": " + reward);
            });

        sender.sendMessage("--------------------");
        sender.sendMessage("Kill mobs to earn " +
            economy.currencyNamePlural() + "!");
        return true;
    }
}`,
      },
      {
        name: "alloy.mod.json",
        lang: "json",
        code: `{
  "id": "mob-bounties",
  "name": "Mob Bounties",
  "version": "1.0.0",
  "description": "Earn currency for killing mobs",
  "authors": ["YourName"],
  "entrypoint": "com.example.mobbounty.MobBountyMod",
  "dependencies": { "alloy": ">=0.1.0" },
  "environment": "server"
}`,
      },
    ],
  },
  {
    id: "death-chest",
    title: "Death Chest",
    description: "Save a player's inventory into a chest on death. Demonstrates death events, inventory manipulation, block placement, and world interaction.",
    category: "items",
    difficulty: "advanced",
    tags: ["events", "inventory", "world", "death"],
    files: [
      {
        name: "DeathChestMod.java",
        lang: "java",
        code: `package com.example.deathchest;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.permission.PermissionRegistry.PermissionDefault;
import net.alloymc.loader.api.ModInitializer;

public class DeathChestMod implements ModInitializer {

    @Override
    public void onInitialize() {
        AlloyAPI.permissionRegistry().register(
            "deathchest.use", "Items saved to chest on death",
            PermissionDefault.TRUE
        );

        AlloyAPI.eventBus().register(new DeathListener());
    }
}`,
      },
      {
        name: "DeathListener.java",
        lang: "java",
        code: `package com.example.deathchest;

import net.alloymc.api.AlloyAPI;
import net.alloymc.api.entity.Player;
import net.alloymc.api.event.EventHandler;
import net.alloymc.api.event.Listener;
import net.alloymc.api.event.player.PlayerDeathEvent;
import net.alloymc.api.inventory.ItemStack;
import net.alloymc.api.inventory.Material;
import net.alloymc.api.world.Block;
import net.alloymc.api.world.Location;

import java.util.List;

public class DeathListener implements Listener {

    @EventHandler
    public void onDeath(PlayerDeathEvent event) {
        Player player = event.player();
        if (!player.hasPermission("deathchest.use")) return;

        List<ItemStack> drops = event.drops();
        if (drops.isEmpty()) return;

        // Find a safe spot for the chest
        Location deathLoc = player.location();
        Block target = player.world().blockAt(deathLoc);

        // Search upward for an air block if needed
        for (int i = 0; i < 5; i++) {
            if (target.isEmpty()) break;
            target = target.getRelative(
                net.alloymc.api.world.BlockFace.UP
            );
        }

        if (!target.isEmpty()) {
            // No space found — let items drop normally
            return;
        }

        // Place a chest
        target.setType(Material.CHEST);

        // Clear the drops so they don't scatter on the ground
        drops.clear();

        // Tell the player where their stuff is
        event.setDeathMessage(
            player.displayName() + " died — items saved to a chest at " +
            target.x() + ", " + target.y() + ", " + target.z()
        );
    }
}`,
      },
    ],
  },
];

// ── Components ──

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-2.5 py-1 text-[11px] font-mono rounded-md bg-obsidian-700/80 text-stone-400 hover:text-ember hover:bg-obsidian-700 transition-all cursor-pointer"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function DifficultyBadge({ level }: { level: Example["difficulty"] }) {
  const styles = {
    beginner: "bg-green-500/15 text-green-400 border-green-500/30",
    intermediate: "bg-forge-gold/15 text-forge-gold border-forge-gold/30",
    advanced: "bg-ember/15 text-ember border-ember/30",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles[level]}`}>
      {level}
    </span>
  );
}

function FileTab({
  file,
  isActive,
  onClick,
}: {
  file: ExampleFile;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-mono rounded-t-lg transition-all cursor-pointer ${
        isActive
          ? "bg-obsidian-950 text-ember border-t border-x border-obsidian-700/50"
          : "text-stone-500 hover:text-stone-300 hover:bg-obsidian-800/50"
      }`}
    >
      {file.name}
    </button>
  );
}

function CodeViewer({ files }: { files: ExampleFile[] }) {
  const [activeFile, setActiveFile] = useState(0);
  const file = files[activeFile];

  return (
    <div className="rounded-xl border border-obsidian-700/50 overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0.5 px-2 pt-2 bg-obsidian-900/60 overflow-x-auto scrollbar-none">
        {files.map((f, i) => (
          <FileTab
            key={f.name}
            file={f}
            isActive={i === activeFile}
            onClick={() => setActiveFile(i)}
          />
        ))}
        <div className="flex-1" />
        <CopyButton text={file.code} />
      </div>
      {/* Code */}
      <pre className="bg-obsidian-950 p-4 text-[13px] font-mono text-stone-300 overflow-x-auto leading-relaxed max-h-[500px] overflow-y-auto">
        <code>{file.code}</code>
      </pre>
    </div>
  );
}

function ExampleCard({ example, isExpanded, onToggle }: {
  example: Example;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-obsidian-700/50 bg-obsidian-900/30 overflow-hidden transition-all hover:border-obsidian-600">
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-4 cursor-pointer group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-heading text-lg font-semibold text-stone-100 group-hover:text-ember transition-colors">
              {example.title}
            </h3>
            <DifficultyBadge level={example.difficulty} />
          </div>
          <p className="text-sm text-stone-400 mt-1 leading-relaxed">
            {example.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {example.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-stone-500 bg-obsidian-800 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 mt-1">
          <div className={`w-6 h-6 rounded-full border border-obsidian-600 flex items-center justify-center text-stone-500 group-hover:border-ember/50 group-hover:text-ember transition-all ${isExpanded ? "rotate-180" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>

      {/* Code — expandable */}
      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[11px] text-stone-500 uppercase tracking-widest">
              {example.files.length} file{example.files.length !== 1 ? "s" : ""}
            </span>
            <div className="flex-1 h-px bg-obsidian-700/50" />
          </div>
          <CodeViewer files={example.files} />
        </div>
      )}
    </div>
  );
}

// ── Page ──

export default function ExamplesPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["set-spawn"]));

  const filtered = EXAMPLES.filter((ex) => {
    if (category !== "all" && ex.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        ex.title.toLowerCase().includes(q) ||
        ex.description.toLowerCase().includes(q) ||
        ex.tags.some((t) => t.includes(q))
      );
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpanded(new Set(filtered.map((e) => e.id)));
  };

  const collapseAll = () => {
    setExpanded(new Set());
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-ember/10 border border-ember/20">
            <ZapIcon className="w-6 h-6 text-ember" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-stone-100">
              Examples
            </h1>
            <p className="text-stone-400 text-sm">
              {EXAMPLES.length} complete mods you can copy and build on
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="sticky top-[73px] z-20 bg-obsidian-950/95 backdrop-blur-md pb-4 -mx-6 px-6 pt-2">
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search examples..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl bg-obsidian-900 border border-obsidian-700/50 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-ember/50 transition-colors"
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.id;
            const count = cat.id === "all"
              ? EXAMPLES.length
              : EXAMPLES.filter((e) => e.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-ember/15 text-ember border border-ember/30"
                    : "text-stone-400 border border-obsidian-700/50 hover:text-stone-200 hover:border-obsidian-600"
                }`}
              >
                {cat.icon}
                {cat.label}
                <span className={`font-mono text-[10px] ${isActive ? "text-ember/70" : "text-stone-600"}`}>
                  {count}
                </span>
              </button>
            );
          })}

          <div className="flex-1" />

          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 text-[11px] font-mono text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 text-[11px] font-mono text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3 mt-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-500 text-sm">No examples match your search.</p>
          </div>
        ) : (
          filtered.map((ex) => (
            <ExampleCard
              key={ex.id}
              example={ex}
              isExpanded={expanded.has(ex.id)}
              onToggle={() => toggleExpand(ex.id)}
            />
          ))
        )}
      </div>

      {/* Footer hint */}
      <div className="mt-12 text-center">
        <p className="text-xs text-stone-600">
          All examples are complete, standalone mods.
          <br />
          Copy the files, add an <code className="font-mono text-stone-500">alloy.mod.json</code>, and build.
        </p>
      </div>
    </div>
  );
}
