/** One choice in a New run sheet (an agent, a folder, a runtime, a model). */
export interface MobileLaunchPickerItem {
  id: string
  label: string
  detail?: string
  group?: string
  /** autobyteus-458: a choice that cannot run now (usage limit reached): its reason, e.g. "Limit reached · back at 3:40 pm"; it cannot be picked. */
  unavailable?: string
}
