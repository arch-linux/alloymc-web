import type { DocPage } from "../types";

export const commandsDoc: DocPage = {
  slug: "commands",
  title: "Commands",
  description: "Register custom slash commands with arguments and tab completion.",
  category: "systems",
  order: 0,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "The command system lets you register custom slash commands that players and the console can execute. Each command has a name, description, permission, optional aliases, an execute handler, and optional tab completion.\n\nCommands are registered through `AlloyAPI.commandRegistry()` during `onInitialize()`.",
    },
    {
      id: "command-class",
      title: "Command",
      content: "The abstract base class for all commands. Extend it with an anonymous class or a named subclass.",
      methods: [
        {
          signature: "new Command(String name, String description, String permission)",
          description: "Creates a command with a name, description, and required permission.",
          params: [
            { name: "name", type: "String", description: "The command name (without slash)" },
            { name: "description", type: "String", description: "A short description" },
            { name: "permission", type: "String", description: "Permission node required to use this command" },
          ],
        },
        {
          signature: "new Command(String name, String description, String permission, List<String> aliases)",
          description: "Creates a command with additional aliases.",
          params: [
            { name: "name", type: "String", description: "The command name" },
            { name: "description", type: "String", description: "A short description" },
            { name: "permission", type: "String", description: "Permission node" },
            { name: "aliases", type: "List<String>", description: "Alternative names for this command" },
          ],
        },
        {
          signature: "execute(CommandSender sender, String label, String[] args): boolean",
          description: "Called when the command is executed. Return true on success, false to show usage.",
          params: [
            { name: "sender", type: "CommandSender", description: "Who ran the command (player or console)" },
            { name: "label", type: "String", description: "The exact command name/alias used" },
            { name: "args", type: "String[]", description: "Arguments after the command name" },
          ],
          returns: { type: "boolean", description: "True for success, false to show usage" },
        },
        {
          signature: "tabComplete(CommandSender sender, String label, String[] args): List<String>",
          description: "Called when a player presses Tab for suggestions. Override to provide custom completions. Returns empty list by default.",
          params: [
            { name: "sender", type: "CommandSender", description: "The player pressing Tab" },
            { name: "label", type: "String", description: "The command name/alias" },
            { name: "args", type: "String[]", description: "Arguments typed so far" },
          ],
          returns: { type: "List<String>", description: "List of suggestions" },
        },
      ],
    },
    {
      id: "command-sender",
      title: "CommandSender",
      content: "The interface for anything that can run commands — players and the server console.",
      methods: [
        {
          signature: "sender.name(): String",
          description: "The sender's name (player username or \"CONSOLE\").",
          returns: { type: "String", description: "The name" },
        },
        {
          signature: "sender.sendMessage(String message): void",
          description: "Sends a message to the sender.",
          params: [{ name: "message", type: "String", description: "The message" }],
        },
        {
          signature: "sender.isPlayer(): boolean",
          description: "Whether this sender is a player (safe to cast to Player).",
          returns: { type: "boolean", description: "True if player" },
        },
        {
          signature: "sender.hasPermission(String permission): boolean",
          description: "Checks if the sender has a permission. Console always returns true.",
          params: [{ name: "permission", type: "String", description: "The permission node" }],
          returns: { type: "boolean", description: "True if permitted" },
        },
      ],
    },
    {
      id: "command-registry",
      title: "CommandRegistry",
      content: "The central registry for all commands.",
      methods: [
        {
          signature: "registry.register(Command command): void",
          description: "Registers a command. The command becomes available to players immediately.",
          params: [{ name: "command", type: "Command", description: "The command to register" }],
        },
        {
          signature: "registry.get(String name): Command",
          description: "Looks up a registered command by name.",
          params: [{ name: "name", type: "String", description: "The command name" }],
          returns: { type: "Command", description: "The command, or null" },
        },
        {
          signature: "registry.all(): Collection<Command>",
          description: "Returns all registered commands.",
          returns: { type: "Collection<Command>", description: "All commands" },
        },
      ],
    },
    {
      id: "example",
      title: "Full Example",
      content: "A complete command with argument handling, player detection, and tab completion:",
      code: `public class HealCommand extends Command {

    public HealCommand() {
        super("heal", "Heal yourself or another player",
              "mymod.heal", List.of("hp"));
    }

    @Override
    public boolean execute(CommandSender sender, String label, String[] args) {
        Player target;

        if (args.length > 0) {
            // Heal a specific player
            var found = AlloyAPI.server().player(args[0]);
            if (found.isEmpty()) {
                sender.sendMessage("Player not found: " + args[0]);
                return true;
            }
            target = found.get();
        } else if (sender.isPlayer()) {
            // Heal self
            target = (Player) sender;
        } else {
            sender.sendMessage("Console must specify a player name.");
            return true;
        }

        target.setHealth(target.maxHealth());
        target.sendMessage("You have been healed!");

        if (target != sender) {
            sender.sendMessage("Healed " + target.displayName());
        }

        return true;
    }

    @Override
    public List<String> tabComplete(CommandSender sender,
                                     String label, String[] args) {
        if (args.length == 1) {
            String partial = args[0].toLowerCase();
            return AlloyAPI.server().onlinePlayers().stream()
                .map(Player::name)
                .filter(name -> name.toLowerCase().startsWith(partial))
                .toList();
        }
        return Collections.emptyList();
    }
}

// Register in onInitialize():
AlloyAPI.commandRegistry().register(new HealCommand());`,
      codeLang: "java",
    },
  ],
};
