import type { Format, Language, Status } from "@/types/session"

export type DisplaySpec = { description: string; icon: string }

// One entry per backend value, so adding an enum value is a type error until it has a label.
// UNKNOWN has no icon and no filter option. Entry order is the order filters list them in.

export const formatDisplay: Record<Format, DisplaySpec | undefined> = {
  PRESENTATION: {
    description: "Presentation",
    icon: "carbon:group-presentation",
  },
  LIGHTNING_TALK: { description: "Lightning Talk", icon: "carbon:lightning" },
  WORKSHOP: { description: "Workshop", icon: "carbon:laptop" },
  PANEL: { description: "Panel Debate", icon: "carbon:forum" },
  UNKNOWN: undefined,
}

export const statusDisplay: Record<Status, DisplaySpec | undefined> = {
  APPROVED: { description: "Approved", icon: "carbon:task-approved" },
  SUBMITTED: { description: "Submitted", icon: "carbon:task-view" },
  REJECTED: { description: "Rejected", icon: "carbon:task-remove" },
  HISTORIC: { description: "Historic", icon: "carbon:task-asset-view" },
  DRAFT: { description: "Draft", icon: "carbon:task-add" },
  UNKNOWN: undefined,
}

export const languageDisplay: Record<Language, DisplaySpec | undefined> = {
  ENGLISH: { description: "English", icon: "openmoji:flag-united-kingdom" },
  NORWEGIAN: { description: "Norwegian", icon: "openmoji:flag-norway" },
  UNKNOWN: undefined,
}

export type FilterItem<T> = { label: string; value: T | undefined }

// "Any" first, then every value that has a label
export const filterItems = <T extends string>(
  display: Record<T, DisplaySpec | undefined>,
): FilterItem<T>[] => [
  { label: "Any", value: undefined },
  ...(Object.entries(display) as [T, DisplaySpec | undefined][]).flatMap(
    ([value, spec]) => (spec ? [{ label: spec.description, value }] : []),
  ),
]
