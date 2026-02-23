import type { DocPage, DocCategory } from "./types";

// Import all doc pages
import { gettingStartedDoc } from "./content/getting-started";
import { apiOverviewDoc } from "./content/api-overview";
import { eventsDoc } from "./content/events";
import { blockEventsDoc } from "./content/block-events";
import { entityEventsDoc } from "./content/entity-events";
import { playerEventsDoc } from "./content/player-events";
import { entitiesDoc } from "./content/entities";
import { worldDoc } from "./content/world";
import { inventoryDoc } from "./content/inventory";
import { commandsDoc } from "./content/commands";
import { permissionsDoc } from "./content/permissions";
import { economyDoc } from "./content/economy";
import { schedulingDoc } from "./content/scheduling";
import { configurationDoc } from "./content/configuration";
import { modManifestDoc } from "./content/mod-manifest";
import { mappingsDoc } from "./content/mappings";
import { guiMenusDoc } from "./content/gui-menus";
import { guiScreensDoc } from "./content/gui-screens";
import { inventoryEventsDoc } from "./content/inventory-events";

export const DOC_CATEGORIES: DocCategory[] = [
  { id: "guide", label: "Guides", order: 0 },
  { id: "api", label: "API Reference", order: 1 },
  { id: "systems", label: "Systems", order: 2 },
  { id: "config", label: "Configuration", order: 3 },
];

// All doc pages — add new pages here
const ALL_DOCS: DocPage[] = [
  gettingStartedDoc,
  apiOverviewDoc,
  eventsDoc,
  blockEventsDoc,
  entityEventsDoc,
  playerEventsDoc,
  entitiesDoc,
  worldDoc,
  inventoryDoc,
  commandsDoc,
  permissionsDoc,
  economyDoc,
  schedulingDoc,
  configurationDoc,
  modManifestDoc,
  mappingsDoc,
  guiMenusDoc,
  guiScreensDoc,
  inventoryEventsDoc,
];

export function getAllDocs(): DocPage[] {
  return ALL_DOCS.sort((a, b) => {
    const catA = DOC_CATEGORIES.find((c) => c.id === a.category)?.order ?? 99;
    const catB = DOC_CATEGORIES.find((c) => c.id === b.category)?.order ?? 99;
    if (catA !== catB) return catA - catB;
    return a.order - b.order;
  });
}

export function getDocBySlug(slug: string): DocPage | undefined {
  return ALL_DOCS.find((d) => d.slug === slug);
}

export function getDocsByCategory(categoryId: string): DocPage[] {
  return ALL_DOCS
    .filter((d) => d.category === categoryId)
    .sort((a, b) => a.order - b.order);
}

export type { DocPage, DocSection, ApiMethod, ApiField, EnumValue, DocCategory } from "./types";
