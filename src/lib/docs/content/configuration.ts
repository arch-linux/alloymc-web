import type { DocPage } from "../types";

export const configurationDoc: DocPage = {
  slug: "configuration",
  title: "Configuration",
  description: "Load, save, and access mod configuration with nested dot-path keys.",
  category: "config",
  order: 0,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "The `Configuration` class provides a hierarchical key-value store for mod settings. Keys use **dot-separated paths** to access nested values (e.g., `database.host`). All primitive types, strings, and string lists are supported.\n\nConfigurations are plain data objects — you create them, read/write values, and are responsible for serializing them to disk (or any other storage).",
    },
    {
      id: "configuration",
      title: "Configuration",
      content: "The main configuration class.",
      methods: [
        {
          signature: "new Configuration()",
          description: "Creates an empty configuration.",
        },
        {
          signature: "new Configuration(Map<String, Object> data)",
          description: "Creates a configuration from an existing map of values.",
          params: [{ name: "data", type: "Map<String, Object>", description: "Initial key-value pairs" }],
        },
        {
          signature: "config.set(String path, Object value): void",
          description: "Sets a value at the given dot-separated path. Creates intermediate sections as needed.",
          params: [
            { name: "path", type: "String", description: "Dot-separated key path (e.g., \"server.port\")" },
            { name: "value", type: "Object", description: "The value to set" },
          ],
        },
        {
          signature: "config.get(String path): Object",
          description: "Gets the raw value at a path.",
          params: [{ name: "path", type: "String", description: "Dot-separated key path" }],
          returns: { type: "Object", description: "The value, or null if not found" },
        },
        {
          signature: "config.keys(): Set<String>",
          description: "Returns the top-level keys in this configuration.",
          returns: { type: "Set<String>", description: "Set of key names" },
        },
        {
          signature: "config.toMap(): Map<String, Object>",
          description: "Converts the entire configuration to a nested map. Useful for serialization.",
          returns: { type: "Map<String, Object>", description: "Full config as a map" },
        },
      ],
    },
    {
      id: "typed-getters",
      title: "Typed Getters",
      content: "All typed getters take a default value that's returned if the key doesn't exist or has an incompatible type.",
      methods: [
        {
          signature: "config.getString(String path, String defaultValue): String",
          description: "Gets a string value.",
          params: [
            { name: "path", type: "String", description: "Dot-separated path" },
            { name: "defaultValue", type: "String", description: "Fallback value" },
          ],
          returns: { type: "String", description: "The string value or default" },
        },
        {
          signature: "config.getInt(String path, int defaultValue): int",
          description: "Gets an integer value.",
          params: [
            { name: "path", type: "String", description: "Dot-separated path" },
            { name: "defaultValue", type: "int", description: "Fallback value" },
          ],
          returns: { type: "int", description: "The int value or default" },
        },
        {
          signature: "config.getLong(String path, long defaultValue): long",
          description: "Gets a long value.",
          params: [
            { name: "path", type: "String", description: "Dot-separated path" },
            { name: "defaultValue", type: "long", description: "Fallback value" },
          ],
          returns: { type: "long", description: "The long value or default" },
        },
        {
          signature: "config.getDouble(String path, double defaultValue): double",
          description: "Gets a double value.",
          params: [
            { name: "path", type: "String", description: "Dot-separated path" },
            { name: "defaultValue", type: "double", description: "Fallback value" },
          ],
          returns: { type: "double", description: "The double value or default" },
        },
        {
          signature: "config.getBoolean(String path, boolean defaultValue): boolean",
          description: "Gets a boolean value.",
          params: [
            { name: "path", type: "String", description: "Dot-separated path" },
            { name: "defaultValue", type: "boolean", description: "Fallback value" },
          ],
          returns: { type: "boolean", description: "The boolean value or default" },
        },
        {
          signature: "config.getStringList(String path): List<String>",
          description: "Gets a list of strings. Returns an empty list if the key doesn't exist.",
          params: [{ name: "path", type: "String", description: "Dot-separated path" }],
          returns: { type: "List<String>", description: "List of strings" },
        },
        {
          signature: "config.getSection(String path): Configuration",
          description: "Gets a nested section as a Configuration object. Returns null if not found.",
          params: [{ name: "path", type: "String", description: "Dot-separated path to the section" }],
          returns: { type: "Configuration", description: "The nested section, or null" },
        },
      ],
    },
    {
      id: "example",
      title: "Example",
      content: "A typical mod configuration setup:",
      code: `public class MyMod implements ModInitializer {
    private Configuration config;

    @Override
    public void onInitialize() {
        // Load or create default config
        config = new Configuration();

        // Set defaults
        config.set("general.enabled", true);
        config.set("general.maxPlayers", 50);
        config.set("database.host", "localhost");
        config.set("database.port", 3306);
        config.set("database.name", "mymod");
        config.set("messages.welcome", "Welcome to the server!");
        config.set("features.teleport.cooldown", 30);
        config.set("features.teleport.maxDistance", 10000);

        // Read values later
        boolean enabled = config.getBoolean("general.enabled", true);
        String dbHost = config.getString("database.host", "localhost");
        int cooldown = config.getInt("features.teleport.cooldown", 30);

        // Access a nested section
        Configuration dbConfig = config.getSection("database");
        if (dbConfig != null) {
            String host = dbConfig.getString("host", "localhost");
            int port = dbConfig.getInt("port", 3306);
        }
    }
}`,
      codeLang: "java",
    },
  ],
};
