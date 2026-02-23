import type { DocPage } from "../types";

export const economyDoc: DocPage = {
  slug: "economy",
  title: "Economy",
  description: "Integrate with the built-in economy system to handle player balances, transactions, and custom currency providers.",
  category: "systems",
  order: 2,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "Alloy ships with a built-in economy system that mods can use out of the box. Instead of requiring a third-party bridge plugin (like Vault on Bukkit), every Alloy server has economy support from day one.\n\nThe economy API lives in `AlloyAPI.economy()` and provides a clean interface for checking balances, depositing, withdrawing, and transferring currency between players. A default file-based economy provider is included in Alloy Core, but mods can replace it with a database-backed implementation or integrate with external systems.\n\nThis means any mod that needs an economy — land claims, shops, bounties, auctions — works immediately without extra setup.",
    },
    {
      id: "economy-provider",
      title: "EconomyProvider",
      content: "The core interface that all economy implementations must satisfy. Access it via `AlloyAPI.economy()`.",
      methods: [
        {
          signature: "provider.balance(UUID playerId): double",
          description: "Returns the player's current balance.",
          params: [{ name: "playerId", type: "UUID", description: "The player's unique ID" }],
          returns: { type: "double", description: "The player's balance" },
        },
        {
          signature: "provider.deposit(UUID playerId, double amount): boolean",
          description: "Adds funds to a player's account. Returns true if the transaction succeeded.",
          params: [
            { name: "playerId", type: "UUID", description: "The player's unique ID" },
            { name: "amount", type: "double", description: "Amount to deposit (must be positive)" },
          ],
          returns: { type: "boolean", description: "True if the deposit succeeded" },
        },
        {
          signature: "provider.withdraw(UUID playerId, double amount): boolean",
          description: "Removes funds from a player's account. Returns false if the player has insufficient funds.",
          params: [
            { name: "playerId", type: "UUID", description: "The player's unique ID" },
            { name: "amount", type: "double", description: "Amount to withdraw (must be positive)" },
          ],
          returns: { type: "boolean", description: "True if the withdrawal succeeded, false if insufficient funds" },
        },
        {
          signature: "provider.has(UUID playerId, double amount): boolean",
          description: "Checks if a player can afford a given amount without actually withdrawing.",
          params: [
            { name: "playerId", type: "UUID", description: "The player's unique ID" },
            { name: "amount", type: "double", description: "The amount to check" },
          ],
          returns: { type: "boolean", description: "True if the player's balance is at least the given amount" },
        },
        {
          signature: "provider.transfer(UUID from, UUID to, double amount): boolean",
          description: "Atomically transfers funds from one player to another. Withdraws from the sender and deposits to the receiver in a single operation.",
          params: [
            { name: "from", type: "UUID", description: "The sender's UUID" },
            { name: "to", type: "UUID", description: "The receiver's UUID" },
            { name: "amount", type: "double", description: "Amount to transfer" },
          ],
          returns: { type: "boolean", description: "True if the transfer succeeded" },
        },
        {
          signature: "provider.format(double amount): String",
          description: "Formats an amount as a human-readable string using the currency's display format (e.g., \"$1,250.00\" or \"1,250 coins\").",
          params: [{ name: "amount", type: "double", description: "The amount to format" }],
          returns: { type: "String", description: "The formatted string" },
        },
        {
          signature: "provider.currencyName(): String",
          description: "Returns the singular name of the currency (e.g., \"dollar\", \"coin\", \"credit\").",
          returns: { type: "String", description: "Singular currency name" },
        },
        {
          signature: "provider.currencyNamePlural(): String",
          description: "Returns the plural name of the currency (e.g., \"dollars\", \"coins\", \"credits\").",
          returns: { type: "String", description: "Plural currency name" },
        },
        {
          signature: "provider.currencySymbol(): String",
          description: "Returns the currency symbol used in formatting (e.g., \"$\", \"C\"). May be empty if the currency uses a name-based format.",
          returns: { type: "String", description: "Currency symbol" },
        },
        {
          signature: "provider.createAccount(UUID playerId): void",
          description: "Creates an account for a new player with the configured starting balance. Called automatically on first join.",
          params: [{ name: "playerId", type: "UUID", description: "The player's unique ID" }],
        },
        {
          signature: "provider.hasAccount(UUID playerId): boolean",
          description: "Checks if an account exists for the given player.",
          params: [{ name: "playerId", type: "UUID", description: "The player's unique ID" }],
          returns: { type: "boolean", description: "True if the player has an account" },
        },
      ],
    },
    {
      id: "accessing",
      title: "Accessing the Economy",
      content: "The economy provider is available globally through `AlloyAPI`. Always check for availability before using it — the provider may not be set if economy is disabled in the server config.",
      code: `EconomyProvider economy = AlloyAPI.economy();
if (economy == null) {
    // No economy provider active
    return;
}

// Check balance
double balance = economy.balance(player.uniqueId());
player.sendMessage("Balance: " + economy.format(balance));

// Withdraw funds
if (economy.withdraw(player.uniqueId(), 500.0)) {
    player.sendMessage("Purchased! New balance: " + economy.format(economy.balance(player.uniqueId())));
} else {
    player.sendMessage("Not enough " + economy.currencyNamePlural() + ".");
}`,
      codeLang: "java",
    },
    {
      id: "default-provider",
      title: "Default Provider (Alloy Core)",
      content:
        "Alloy Core ships with a file-based economy provider that works out of the box. Player balances are stored as JSON files in the server's `economy/` directory. Configuration is handled through `economy.properties` in the server root.\n\nThe default provider supports all core operations and is suitable for small to medium servers. For larger servers or advanced features (per-world economies, transaction logging, bank accounts), a mod can replace it with a custom provider.",
      fields: [
        {
          name: "economy.enabled",
          type: "boolean",
          description: "Whether the built-in economy is active.",
          defaultValue: "true",
        },
        {
          name: "economy.starting-balance",
          type: "double",
          description: "The balance given to new players on first join.",
          defaultValue: "1000.0",
        },
        {
          name: "economy.currency-name",
          type: "String",
          description: "Singular name of the currency.",
          defaultValue: "dollar",
        },
        {
          name: "economy.currency-name-plural",
          type: "String",
          description: "Plural name of the currency.",
          defaultValue: "dollars",
        },
        {
          name: "economy.currency-symbol",
          type: "String",
          description: "Symbol displayed before amounts.",
          defaultValue: "$",
        },
      ],
    },
    {
      id: "custom-provider",
      title: "Custom Economy Provider",
      content: "Mods can replace the default economy with a custom implementation. Register your provider during initialization and it will be used for all economy operations server-wide.",
      code: `public class DatabaseEconomy implements EconomyProvider {

    private final DataSource db;

    @Override
    public double balance(UUID playerId) {
        return db.queryBalance(playerId);
    }

    @Override
    public boolean withdraw(UUID playerId, double amount) {
        if (amount <= 0) return false;
        return db.atomicWithdraw(playerId, amount);
    }

    @Override
    public boolean deposit(UUID playerId, double amount) {
        if (amount <= 0) return false;
        return db.atomicDeposit(playerId, amount);
    }

    @Override
    public boolean has(UUID playerId, double amount) {
        return balance(playerId) >= amount;
    }

    @Override
    public boolean transfer(UUID from, UUID to, double amount) {
        if (amount <= 0) return false;
        return db.atomicTransfer(from, to, amount);
    }

    @Override
    public String format(double amount) {
        return String.format("$%,.2f", amount);
    }

    @Override
    public String currencyName() { return "dollar"; }

    @Override
    public String currencyNamePlural() { return "dollars"; }

    @Override
    public String currencySymbol() { return "$"; }

    @Override
    public void createAccount(UUID playerId) {
        db.insertAccount(playerId, 1000.0);
    }

    @Override
    public boolean hasAccount(UUID playerId) {
        return db.accountExists(playerId);
    }
}

// In your mod's onInitialize():
AlloyAPI.setEconomyProvider(new DatabaseEconomy(dataSource));`,
      codeLang: "java",
    },
    {
      id: "built-in-commands",
      title: "Built-in Commands",
      content: "Alloy Core registers economy commands automatically when the economy provider is active. These provide standard money management for players and admins.",
      subsections: [
        {
          id: "player-commands",
          title: "Player Commands",
          content: "Available to all players by default.",
          methods: [
            {
              signature: "/balance",
              description: "Shows your current balance. Aliases: `/bal`, `/money`.",
            },
            {
              signature: "/pay <player> <amount>",
              description: "Transfers money to another player. Validates the amount is positive and that you have sufficient funds.",
            },
          ],
        },
        {
          id: "admin-commands",
          title: "Admin Commands",
          content: "Require the `alloy.economy.admin` permission.",
          methods: [
            {
              signature: "/eco give <player> <amount>",
              description: "Deposits money into a player's account.",
            },
            {
              signature: "/eco take <player> <amount>",
              description: "Withdraws money from a player's account.",
            },
            {
              signature: "/eco set <player> <amount>",
              description: "Sets a player's balance to an exact amount.",
            },
            {
              signature: "/eco reset <player>",
              description: "Resets a player's balance to the configured starting amount.",
            },
          ],
        },
      ],
    },
    {
      id: "mod-integration",
      title: "Mod Integration Examples",
      content: "The economy API is designed to be used by any mod that needs a currency system. Here are common patterns.",
      subsections: [
        {
          id: "shop-example",
          title: "Shop System",
          code: `public boolean purchaseItem(Player buyer, Material item, double price) {
    EconomyProvider eco = AlloyAPI.economy();
    if (eco == null) {
        buyer.sendMessage("Economy is not available.");
        return false;
    }

    if (!eco.has(buyer.uniqueId(), price)) {
        buyer.sendMessage("You need " + eco.format(price) + " but only have "
                + eco.format(eco.balance(buyer.uniqueId())) + ".");
        return false;
    }

    eco.withdraw(buyer.uniqueId(), price);
    // Give the item to the player...
    buyer.sendMessage("Purchased! -" + eco.format(price));
    return true;
}`,
          codeLang: "java",
        },
        {
          id: "claim-blocks-example",
          title: "Buying Claim Blocks",
          content: "Land claim mods can let players exchange currency for claim blocks:",
          code: `// /buyclaimblocks <amount>
public void executeBuyClaimBlocks(Player player, int blocks) {
    EconomyProvider eco = AlloyAPI.economy();
    if (eco == null) {
        player.sendMessage("Economy is not available on this server.");
        return;
    }

    double costPerBlock = config.claimBlockCost; // e.g., 1.0
    double totalCost = blocks * costPerBlock;

    if (!eco.withdraw(player.uniqueId(), totalCost)) {
        player.sendMessage("You need " + eco.format(totalCost)
                + " to buy " + blocks + " claim blocks.");
        return;
    }

    PlayerData data = claimManager.getPlayerData(player.uniqueId());
    data.addBonusClaimBlocks(blocks);

    player.sendMessage("Purchased " + blocks + " claim blocks for "
            + eco.format(totalCost) + ". Remaining balance: "
            + eco.format(eco.balance(player.uniqueId())));
}`,
          codeLang: "java",
        },
      ],
    },
    {
      id: "permissions",
      title: "Permissions",
      content: "Economy commands use the following permission nodes, all registered automatically by Alloy Core:",
      fields: [
        {
          name: "alloy.economy.balance",
          type: "PermissionDefault.TRUE",
          description: "View your own balance with /balance.",
        },
        {
          name: "alloy.economy.pay",
          type: "PermissionDefault.TRUE",
          description: "Send money to other players with /pay.",
        },
        {
          name: "alloy.economy.balance.others",
          type: "PermissionDefault.OP",
          description: "View other players' balances.",
        },
        {
          name: "alloy.economy.admin",
          type: "PermissionDefault.OP",
          description: "Use /eco give, /eco take, /eco set, and /eco reset.",
        },
      ],
    },
  ],
};
