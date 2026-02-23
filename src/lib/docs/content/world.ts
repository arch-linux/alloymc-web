import type { DocPage } from "../types";

export const worldDoc: DocPage = {
  slug: "world",
  title: "World & Blocks",
  description: "World, Location, Block, BlockPosition, BoundingBox, and BlockFace APIs.",
  category: "api",
  order: 6,
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "The world API lets you read and modify the game world — get and set blocks, query properties, and work with positions. Key types:\n\n`World` — A loaded dimension (overworld, nether, end).\n`Location` — A precise position with rotation (immutable record).\n`BlockPosition` — An integer block coordinate (immutable record).\n`Block` — A block in the world at a specific position.\n`BoundingBox` — An axis-aligned box for spatial queries.",
    },
    {
      id: "world",
      title: "World",
      content: "Represents a loaded dimension. Access worlds through `AlloyAPI.server().worlds()` or `AlloyAPI.server().world(name)`.",
      methods: [
        {
          signature: "world.name(): String",
          description: "The world's name (e.g., \"world\", \"world_nether\").",
          returns: { type: "String", description: "The world name" },
        },
        {
          signature: "world.uniqueId(): UUID",
          description: "The world's unique identifier.",
          returns: { type: "UUID", description: "The world UUID" },
        },
        {
          signature: "world.blockAt(int x, int y, int z): Block",
          description: "Gets the block at the given coordinates.",
          params: [
            { name: "x", type: "int", description: "X coordinate" },
            { name: "y", type: "int", description: "Y coordinate" },
            { name: "z", type: "int", description: "Z coordinate" },
          ],
          returns: { type: "Block", description: "The block" },
        },
        {
          signature: "world.blockAt(BlockPosition pos): Block",
          description: "Gets the block at the given position.",
          params: [{ name: "pos", type: "BlockPosition", description: "The position" }],
          returns: { type: "Block", description: "The block" },
        },
        {
          signature: "world.blockAt(Location location): Block",
          description: "Gets the block at the given location (truncates to integers).",
          params: [{ name: "location", type: "Location", description: "The location" }],
          returns: { type: "Block", description: "The block" },
        },
        {
          signature: "world.entities(): Collection<Entity>",
          description: "All entities currently in this world.",
          returns: { type: "Collection<Entity>", description: "All entities" },
        },
        {
          signature: "world.players(): Collection<Player>",
          description: "All players currently in this world.",
          returns: { type: "Collection<Player>", description: "All players" },
        },
        {
          signature: "world.environment(): Environment",
          description: "The dimension type of this world.",
          returns: { type: "Environment", description: "OVERWORLD, NETHER, or THE_END" },
        },
        {
          signature: "world.seaLevel(): int",
          description: "The sea level Y coordinate for this world.",
          returns: { type: "int", description: "Sea level Y" },
        },
        {
          signature: "world.minHeight(): int",
          description: "The minimum build height (e.g., -64 for overworld).",
          returns: { type: "int", description: "Min Y" },
        },
        {
          signature: "world.maxHeight(): int",
          description: "The maximum build height (e.g., 320 for overworld).",
          returns: { type: "int", description: "Max Y" },
        },
        {
          signature: "world.pvpEnabled(): boolean",
          description: "Whether PvP is enabled in this world.",
          returns: { type: "boolean", description: "True if PvP is on" },
        },
      ],
      subsections: [
        {
          id: "environment",
          title: "Environment",
          enumValues: [
            { name: "OVERWORLD", description: "The main overworld dimension" },
            { name: "NETHER", description: "The Nether dimension" },
            { name: "THE_END", description: "The End dimension" },
          ],
        },
      ],
    },
    {
      id: "location",
      title: "Location",
      content: "An immutable record representing a precise position in a world, including rotation. All transformation methods return new instances.",
      methods: [
        {
          signature: "new Location(World world, double x, double y, double z)",
          description: "Creates a location without rotation (yaw and pitch default to 0).",
          params: [
            { name: "world", type: "World", description: "The world" },
            { name: "x", type: "double", description: "X coordinate" },
            { name: "y", type: "double", description: "Y coordinate" },
            { name: "z", type: "double", description: "Z coordinate" },
          ],
        },
        {
          signature: "new Location(World world, double x, double y, double z, float yaw, float pitch)",
          description: "Creates a location with rotation.",
          params: [
            { name: "world", type: "World", description: "The world" },
            { name: "x", type: "double", description: "X coordinate" },
            { name: "y", type: "double", description: "Y coordinate" },
            { name: "z", type: "double", description: "Z coordinate" },
            { name: "yaw", type: "float", description: "Horizontal rotation (-180 to 180)" },
            { name: "pitch", type: "float", description: "Vertical rotation (-90 to 90)" },
          ],
        },
        {
          signature: "location.toBlockPosition(): BlockPosition",
          description: "Converts to integer block coordinates.",
          returns: { type: "BlockPosition", description: "The block position" },
        },
        {
          signature: "location.distance(Location other): double",
          description: "Calculates the distance to another location.",
          params: [{ name: "other", type: "Location", description: "The other location" }],
          returns: { type: "double", description: "Distance in blocks" },
        },
        {
          signature: "location.distanceSquared(Location other): double",
          description: "Calculates the squared distance (faster, avoids sqrt). Use for comparisons.",
          params: [{ name: "other", type: "Location", description: "The other location" }],
          returns: { type: "double", description: "Squared distance" },
        },
        {
          signature: "location.add(double dx, double dy, double dz): Location",
          description: "Returns a new location offset by the given amounts.",
          params: [
            { name: "dx", type: "double", description: "X offset" },
            { name: "dy", type: "double", description: "Y offset" },
            { name: "dz", type: "double", description: "Z offset" },
          ],
          returns: { type: "Location", description: "New offset location" },
        },
        {
          signature: "location.withWorld(World world): Location",
          description: "Returns a new location in a different world with the same coordinates.",
          params: [{ name: "world", type: "World", description: "The new world" }],
          returns: { type: "Location", description: "New location in the other world" },
        },
      ],
    },
    {
      id: "block-position",
      title: "BlockPosition",
      content: "An immutable record for integer block coordinates. Lighter than `Location` when you don't need decimal precision or rotation.",
      methods: [
        {
          signature: "new BlockPosition(int x, int y, int z)",
          description: "Creates a block position.",
          params: [
            { name: "x", type: "int", description: "X coordinate" },
            { name: "y", type: "int", description: "Y coordinate" },
            { name: "z", type: "int", description: "Z coordinate" },
          ],
        },
        {
          signature: "pos.offset(BlockFace face): BlockPosition",
          description: "Returns the adjacent position in the given direction.",
          params: [{ name: "face", type: "BlockFace", description: "The direction" }],
          returns: { type: "BlockPosition", description: "Adjacent position" },
        },
        {
          signature: "pos.add(int dx, int dy, int dz): BlockPosition",
          description: "Returns a new position offset by the given amounts.",
          params: [
            { name: "dx", type: "int", description: "X offset" },
            { name: "dy", type: "int", description: "Y offset" },
            { name: "dz", type: "int", description: "Z offset" },
          ],
          returns: { type: "BlockPosition", description: "New position" },
        },
        {
          signature: "pos.distanceSquared(BlockPosition other): double",
          description: "Squared distance to another position.",
          params: [{ name: "other", type: "BlockPosition", description: "The other position" }],
          returns: { type: "double", description: "Squared distance" },
        },
      ],
    },
    {
      id: "block",
      title: "Block",
      content: "Represents a block in the world at a specific position. Blocks are mutable — you can change their type.",
      methods: [
        {
          signature: "block.world(): World",
          description: "The world this block is in.",
          returns: { type: "World", description: "The world" },
        },
        {
          signature: "block.x(): int / block.y(): int / block.z(): int",
          description: "The block's coordinates.",
          returns: { type: "int", description: "The coordinate" },
        },
        {
          signature: "block.position(): BlockPosition",
          description: "The block's position as a BlockPosition record.",
          returns: { type: "BlockPosition", description: "The position" },
        },
        {
          signature: "block.location(): Location",
          description: "The block's position as a Location (centered, no rotation).",
          returns: { type: "Location", description: "The location" },
        },
        {
          signature: "block.type(): Material",
          description: "The block's material type.",
          returns: { type: "Material", description: "The material" },
        },
        {
          signature: "block.setType(Material material): void",
          description: "Changes the block's type. This modifies the world immediately.",
          params: [{ name: "material", type: "Material", description: "The new material" }],
        },
        {
          signature: "block.getRelative(BlockFace face): Block",
          description: "Gets the adjacent block in the given direction.",
          params: [{ name: "face", type: "BlockFace", description: "The direction" }],
          returns: { type: "Block", description: "The adjacent block" },
        },
        {
          signature: "block.isEmpty(): boolean",
          description: "Whether this block is air.",
          returns: { type: "boolean", description: "True if air" },
        },
        {
          signature: "block.isLiquid(): boolean",
          description: "Whether this block is water or lava.",
          returns: { type: "boolean", description: "True if liquid" },
        },
        {
          signature: "block.isSolid(): boolean",
          description: "Whether this block is solid (can be stood on).",
          returns: { type: "boolean", description: "True if solid" },
        },
      ],
    },
    {
      id: "block-face",
      title: "BlockFace",
      content: "Represents the six cardinal directions plus SELF.",
      enumValues: [
        { name: "NORTH", description: "Negative Z direction (0, 0, -1)" },
        { name: "SOUTH", description: "Positive Z direction (0, 0, 1)" },
        { name: "EAST", description: "Positive X direction (1, 0, 0)" },
        { name: "WEST", description: "Negative X direction (-1, 0, 0)" },
        { name: "UP", description: "Positive Y direction (0, 1, 0)" },
        { name: "DOWN", description: "Negative Y direction (0, -1, 0)" },
        { name: "SELF", description: "No offset (0, 0, 0)" },
      ],
      subsections: [
        {
          id: "block-face-methods",
          title: "Methods",
          methods: [
            {
              signature: "face.offsetX(): int / face.offsetY(): int / face.offsetZ(): int",
              description: "The directional offset values.",
              returns: { type: "int", description: "The offset (-1, 0, or 1)" },
            },
            {
              signature: "face.opposite(): BlockFace",
              description: "Returns the opposite direction (NORTH ↔ SOUTH, UP ↔ DOWN, etc.).",
              returns: { type: "BlockFace", description: "The opposite face" },
            },
          ],
        },
      ],
    },
    {
      id: "bounding-box",
      title: "BoundingBox",
      content: "An immutable axis-aligned bounding box for spatial queries and collision checking.",
      methods: [
        {
          signature: "BoundingBox.of(double x1, double y1, double z1, double x2, double y2, double z2): BoundingBox",
          description: "Creates a bounding box from two corner points. Coordinates are automatically sorted.",
          returns: { type: "BoundingBox", description: "The bounding box" },
        },
        {
          signature: "box.contains(double x, double y, double z): boolean",
          description: "Tests if a point is inside this box.",
          returns: { type: "boolean", description: "True if contained" },
        },
        {
          signature: "box.contains(Location location): boolean",
          description: "Tests if a location is inside this box.",
          returns: { type: "boolean", description: "True if contained" },
        },
        {
          signature: "box.intersects(BoundingBox other): boolean",
          description: "Tests if this box overlaps with another box.",
          returns: { type: "boolean", description: "True if overlapping" },
        },
        {
          signature: "box.volume(): double",
          description: "Calculates the volume of this box.",
          returns: { type: "double", description: "The volume" },
        },
        {
          signature: "box.expand(double amount): BoundingBox",
          description: "Returns a new box expanded in all directions by the given amount.",
          params: [{ name: "amount", type: "double", description: "Expansion amount" }],
          returns: { type: "BoundingBox", description: "Expanded box" },
        },
      ],
    },
  ],
};
