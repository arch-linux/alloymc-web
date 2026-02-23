import type { DocPage } from "../types";

export const guiScreensDoc: DocPage = {
  slug: "gui-screens",
  title: "GUI Screens & Widgets",
  description:
    "AlloyScreen base class and the full widget library for building rich client-side UIs.",
  category: "api",
  order: 9,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "The Alloy client UI system provides a base screen class and a library of styled widgets for building in-game UIs. All widgets follow the Alloy design system (obsidian backgrounds, ember accents).\n\nScreens are client-side only. For server-synced GUIs with item slots, use MenuLayout instead (see GUI Menus).",
    },
    {
      id: "alloy-screen",
      title: "AlloyScreen",
      content:
        "Base class for all Alloy screens. Extends Minecraft's screen system via loader injection. Provides styled background rendering, a managed widget list with automatic input routing, and lifecycle hooks.",
      methods: [
        {
          signature: "init(int width, int height): void",
          description:
            "Called when the screen opens or resizes. Add widgets and set up layout here.",
          params: [
            {
              name: "width",
              type: "int",
              description: "Screen width in GUI-scaled pixels",
            },
            {
              name: "height",
              type: "int",
              description: "Screen height in GUI-scaled pixels",
            },
          ],
        },
        {
          signature:
            "renderContent(int mouseX, int mouseY, int width, int height, float tickDelta): void",
          description:
            "Override to render screen-specific content between the background and widget layers.",
        },
        {
          signature: "render(int mouseX, int mouseY, float tickDelta): void",
          description:
            "Renders background, content, then all widgets. Calls renderContent() internally.",
        },
        {
          signature: "mouseClicked(int mouseX, int mouseY, int button): boolean",
          description:
            "Routes clicks to buttons, sliders, text inputs, checkboxes, tab panels, list views, and text areas.",
          returns: {
            type: "boolean",
            description: "True if a widget consumed the click",
          },
        },
        {
          signature:
            "keyPressed(int keyCode, int scanCode, int modifiers): boolean",
          description: "Routes key presses to focused text inputs.",
          returns: {
            type: "boolean",
            description: "True if a widget consumed the key",
          },
        },
        {
          signature: "charTyped(char ch): boolean",
          description: "Routes character input to focused text inputs.",
          returns: {
            type: "boolean",
            description: "True if a widget consumed the character",
          },
        },
        {
          signature: "mouseScrolled(double amount): boolean",
          description: "Routes scroll events to text areas and list views.",
          returns: {
            type: "boolean",
            description: "True if a widget consumed the scroll",
          },
        },
        {
          signature: "tick(): void",
          description:
            "Called 20 times per second while the screen is open. Override for per-tick logic.",
        },
        {
          signature: "onClose(): void",
          description: "Called when the screen is closed. Override for cleanup.",
        },
      ],
    },
    {
      id: "alloy-button",
      title: "AlloyButton",
      content:
        "A styled button with four visual styles: PRIMARY (ember gradient), SECONDARY (obsidian with border), GHOST (transparent, text only), and DANGER (red-tinted). All have hover, active, and disabled states.",
      methods: [
        {
          signature:
            "new AlloyButton(int x, int y, int width, int height, String label, Style style, Runnable action)",
          description: "Creates a button at the given position.",
          params: [
            { name: "x", type: "int", description: "X position" },
            { name: "y", type: "int", description: "Y position" },
            { name: "width", type: "int", description: "Button width" },
            { name: "height", type: "int", description: "Button height" },
            { name: "label", type: "String", description: "Display text" },
            { name: "style", type: "Style", description: "Visual style" },
            {
              name: "action",
              type: "Runnable",
              description: "Click handler",
            },
          ],
        },
        {
          signature: "setEnabled(boolean enabled): void",
          description: "Enables or disables the button.",
        },
      ],
      enumValues: [
        {
          name: "PRIMARY",
          description: "Ember gradient background — main call-to-action",
        },
        { name: "SECONDARY", description: "Obsidian-700 with subtle border" },
        { name: "GHOST", description: "Transparent; hover reveals background" },
        { name: "DANGER", description: "Red-tinted for destructive actions" },
      ],
    },
    {
      id: "alloy-slider",
      title: "AlloySlider",
      content:
        "A horizontal slider with an obsidian track and ember-colored handle. Supports min/max range, step snapping, and a value formatter.",
      methods: [
        {
          signature:
            "new AlloySlider(int x, int y, int width, int height, String label, double min, double max, double step, double initial, ValueFormatter formatter, Consumer<Double> onChange)",
          description: "Creates a slider with the given range and formatting.",
        },
        {
          signature: "value(): double",
          description: "Returns the current value.",
          returns: { type: "double", description: "Current slider value" },
        },
        {
          signature: "setValue(double value): void",
          description: "Sets the slider value (clamped to min/max).",
        },
      ],
    },
    {
      id: "alloy-progress-bar",
      title: "AlloyProgressBar",
      content:
        "A progress bar for furnace arrows, loading indicators, and similar. Supports horizontal (left-to-right) and vertical (bottom-to-top) fill directions.",
      methods: [
        {
          signature:
            "new AlloyProgressBar(int x, int y, int width, int height, Direction direction)",
          description: "Creates a progress bar.",
        },
        {
          signature: "setProgress(double progress): void",
          description: "Sets the fill level (0.0 to 1.0).",
          params: [
            {
              name: "progress",
              type: "double",
              description: "Fill ratio (0.0 = empty, 1.0 = full)",
            },
          ],
        },
      ],
      enumValues: [
        { name: "HORIZONTAL", description: "Fills left to right" },
        { name: "VERTICAL", description: "Fills bottom to top" },
      ],
    },
    {
      id: "alloy-energy-bar",
      title: "AlloyEnergyBar",
      content:
        "A segmented vertical bar for energy, fluid, or heat gauges. Each segment is colored based on fill level: red (low) → yellow (mid) → green (high). Colors are customizable.",
      methods: [
        {
          signature:
            "new AlloyEnergyBar(int x, int y, int width, int height, int segments)",
          description: "Creates an energy bar with the given segment count.",
        },
        {
          signature: "setLevel(double level): void",
          description: "Sets the fill level (0.0 to 1.0).",
          params: [
            {
              name: "level",
              type: "double",
              description: "Fill ratio (0.0 = empty, 1.0 = full)",
            },
          ],
        },
        {
          signature:
            "setColors(int lowColor, int midColor, int highColor): void",
          description:
            "Customizes the segment colors (ARGB integers).",
        },
      ],
    },
    {
      id: "alloy-text-input",
      title: "AlloyTextInput",
      content:
        "A single-line text input field with cursor and focus support. The border highlights with ember color when focused. Supports arrow key navigation, backspace, delete, home, and end keys.",
      methods: [
        {
          signature:
            "new AlloyTextInput(int x, int y, int width, int height, String placeholder, Consumer<String> onChange)",
          description: "Creates a text input with placeholder text.",
        },
        {
          signature: "text(): String",
          description: "Returns the current text content.",
          returns: { type: "String", description: "The text" },
        },
        {
          signature: "setText(String text): void",
          description: "Sets the text and moves cursor to the end.",
        },
        {
          signature: "setFocused(boolean focused): void",
          description: "Programmatically sets focus.",
        },
      ],
    },
    {
      id: "alloy-text-area",
      title: "AlloyTextArea",
      content:
        "A multi-line scrollable text display for terminal output, logs, and read-only text. Supports auto-scroll (stays at bottom as new lines arrive) and manual scrolling with mouse wheel.",
      methods: [
        {
          signature:
            "new AlloyTextArea(int x, int y, int width, int height, int maxLines)",
          description: "Creates a text area with a maximum line buffer.",
        },
        {
          signature: "appendLine(String line): void",
          description:
            "Appends a line. Oldest lines are trimmed if over maxLines.",
        },
        {
          signature: "clear(): void",
          description: "Clears all text.",
        },
        {
          signature: "setAutoScroll(boolean autoScroll): void",
          description:
            "Enables or disables auto-scroll to bottom on new lines.",
        },
      ],
    },
    {
      id: "alloy-checkbox",
      title: "AlloyCheckbox",
      content:
        "A boolean toggle with a label. Renders as a small square (ember fill when checked) with text to the right.",
      methods: [
        {
          signature:
            "new AlloyCheckbox(int x, int y, String label, boolean initial, Consumer<Boolean> onChange)",
          description: "Creates a checkbox.",
        },
        {
          signature: "isChecked(): boolean",
          description: "Returns the current state.",
          returns: { type: "boolean", description: "True if checked" },
        },
        {
          signature: "setChecked(boolean checked): void",
          description: "Programmatically sets the state.",
        },
      ],
    },
    {
      id: "alloy-tab-panel",
      title: "AlloyTabPanel",
      content:
        "A tabbed container that displays one panel at a time. Tab headers render as a horizontal row with an ember underline on the active tab.",
      methods: [
        {
          signature:
            "new AlloyTabPanel(int x, int y, int width, int height)",
          description: "Creates a tab panel.",
        },
        {
          signature: "addTab(String label): int",
          description: "Adds a tab and returns its index.",
          returns: { type: "int", description: "The tab index" },
        },
        {
          signature: "activeTab(): int",
          description: "Returns the currently active tab index.",
          returns: { type: "int", description: "Active tab index" },
        },
        {
          signature: "setActiveTab(int index): void",
          description: "Switches to a tab programmatically.",
        },
        {
          signature: "setOnTabChange(Consumer<Integer> callback): void",
          description: "Sets a callback fired when the user changes tabs.",
        },
        {
          signature: "contentY(): int",
          description: "Returns the Y coordinate where tab content begins.",
          returns: { type: "int", description: "Content area top Y" },
        },
        {
          signature: "contentHeight(): int",
          description: "Returns the height available for tab content.",
          returns: { type: "int", description: "Content area height" },
        },
      ],
    },
    {
      id: "alloy-list-view",
      title: "AlloyListView",
      content:
        "A scrollable list of selectable text entries. The selected entry is highlighted with an ember accent bar on the left.",
      methods: [
        {
          signature:
            "new AlloyListView(int x, int y, int width, int height)",
          description: "Creates a list view.",
        },
        {
          signature: "addItem(String item): void",
          description: "Appends an item to the list.",
        },
        {
          signature: "setItems(List<String> items): void",
          description: "Replaces all items and resets selection.",
        },
        {
          signature: "clear(): void",
          description: "Clears all items.",
        },
        {
          signature: "selectedIndex(): int",
          description: "Returns the selected index, or -1 if nothing is selected.",
          returns: { type: "int", description: "Selected index" },
        },
        {
          signature: "selectedItem(): String",
          description: "Returns the selected item text, or null.",
          returns: { type: "String", description: "Selected item" },
        },
        {
          signature: "setOnSelect(Consumer<Integer> callback): void",
          description: "Sets a callback fired when the user selects an item.",
        },
      ],
    },
    {
      id: "terminal-example",
      title: "Example: Terminal Screen",
      code: `public class TerminalScreen extends AlloyScreen {
    private AlloyTextArea output;
    private AlloyTextInput input;
    private AlloyButton sendBtn;

    public TerminalScreen() {
        super("Terminal");
    }

    @Override
    public void init(int width, int height) {
        super.init(width, height);

        output = new AlloyTextArea(20, 20, width - 40, height - 80, 500);
        textAreas.add(output);

        input = new AlloyTextInput(20, height - 50, width - 120, 24,
            "Type a command...", text -> {});
        textInputs.add(input);

        sendBtn = new AlloyButton(width - 90, height - 50, 70, 24,
            "Send", AlloyButton.Style.PRIMARY, () -> {
                output.appendLine("> " + input.text());
                input.setText("");
            });
        buttons.add(sendBtn);
    }
}`,
      codeLang: "java",
    },
    {
      id: "config-example",
      title: "Example: Config Screen",
      code: `public class ConfigScreen extends AlloyScreen {
    private AlloyTabPanel tabs;
    private AlloySlider renderDistance;
    private AlloyCheckbox particles;
    private AlloyListView themeList;

    public ConfigScreen() {
        super("Mod Settings");
    }

    @Override
    public void init(int width, int height) {
        super.init(width, height);

        tabs = new AlloyTabPanel(20, 20, width - 40, height - 40);
        tabs.addTab("Graphics");
        tabs.addTab("Gameplay");
        tabs.addTab("Theme");
        tabPanels.add(tabs);

        renderDistance = new AlloySlider(40, tabs.contentY() + 20,
            200, 24, "Render Distance", 2, 32, 1, 12,
            v -> (int) v + " chunks", v -> {});
        sliders.add(renderDistance);

        particles = new AlloyCheckbox(40, tabs.contentY() + 60,
            "Enable Particles", true, checked -> {});
        checkboxes.add(particles);

        themeList = new AlloyListView(40, tabs.contentY() + 20, 200, 150);
        themeList.addItem("Obsidian (Default)");
        themeList.addItem("Ember Glow");
        themeList.addItem("Frost");
        listViews.add(themeList);
    }
}`,
      codeLang: "java",
    },
  ],
};
