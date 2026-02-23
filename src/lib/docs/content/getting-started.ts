import type { DocPage } from "../types";

export const gettingStartedDoc: DocPage = {
  slug: "getting-started",
  title: "Getting Started",
  description: "Set up your development environment and create your first Alloy mod.",
  category: "guide",
  order: 0,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "Alloy unifies mods and plugins into a single concept — **everything is a mod**. Whether you're adding new blocks, tweaking game mechanics, or building a full server plugin, the workflow is the same.\n\nThis guide walks you through setting up a development environment, creating your first mod, and running it on a local server.",
    },
    {
      id: "prerequisites",
      title: "Prerequisites",
      content:
        "Before you begin, make sure you have the following installed:\n\n**Java 21** or later — Alloy targets modern Java for better performance and language features.\n\n**Gradle 8.5+** — The Alloy Gradle plugin handles compilation, remapping, and packaging.\n\n**An IDE** — IntelliJ IDEA is recommended, but any Java IDE with Gradle support works.",
    },
    {
      id: "project-setup",
      title: "Project Setup",
      content: "Create a new Gradle project and add the Alloy Gradle plugin to your `build.gradle.kts`:",
      code: `plugins {
    id("net.alloymc.gradle") version "0.1.0"
    id("java")
}

group = "com.example"
version = "1.0.0"

alloy {
    minecraft("1.21.4")
}

dependencies {
    modImplementation("net.alloymc:alloy-api:0.1.0")
}`,
      codeLang: "kotlin",
    },
    {
      id: "mod-entry",
      title: "Creating the Entry Point",
      content:
        "Every mod needs a class that implements `ModInitializer`. This is where you register event listeners, commands, permissions, and anything else your mod needs.",
      code: `package com.example.mymod;

import net.alloymc.loader.api.ModInitializer;
import net.alloymc.api.AlloyAPI;

public class MyMod implements ModInitializer {

    @Override
    public void onInitialize() {
        AlloyAPI.server().logger().info("MyMod loaded!");
    }
}`,
      codeLang: "java",
    },
    {
      id: "mod-manifest",
      title: "The Mod Manifest",
      content:
        "Create `alloy.mod.json` in `src/main/resources/`. This file tells the loader about your mod — its ID, name, version, and entry point.",
      code: `{
  "id": "mymod",
  "name": "My Mod",
  "version": "1.0.0",
  "description": "My first Alloy mod",
  "authors": ["YourName"],
  "license": "MIT",
  "entrypoint": "com.example.mymod.MyMod",
  "dependencies": {
    "alloy": ">=0.1.0",
    "minecraft": "*"
  },
  "environment": "both"
}`,
      codeLang: "json",
    },
    {
      id: "run-it",
      title: "Running Your Mod",
      content:
        "Use the Gradle `runServer` task to start a local development server with your mod installed:\n\n`./gradlew runServer`\n\nThe server will start with your mod loaded. You'll see your log message in the console output. From here, you can iterate — make changes, rebuild, and the server will pick them up.",
    },
    {
      id: "next-steps",
      title: "Next Steps",
      content:
        "Now that you have a working mod, explore the rest of the documentation:\n\n**Events** — Listen and respond to game events like block breaks, player joins, and entity spawns.\n\n**Commands** — Register custom commands with tab completion.\n\n**World API** — Read and modify blocks, spawn entities, and interact with the world.\n\n**Configuration** — Load and save mod configuration with nested dot-path access.",
    },
  ],
};
