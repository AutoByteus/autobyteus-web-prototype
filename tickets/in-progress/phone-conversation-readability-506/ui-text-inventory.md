# Phone UI text inventory (autobyteus-506, autobyteus-458) — for translation keys from the start (autobyteus-509)

Draft in the design ticket (review 4: no usage-limit texts, no runtime/model under the menu entry, the next-message line only in the saved card; review 3: Settings is the earlier, simple screen again; "This run", the Text size section and its sample line are gone from it); it moves into `ui-ux-spec.md` ("UI text") when the founder approves the design. Key names follow the product's
existing phone namespace (`mobile.nodeDesktop.title` in `localization/messages/en/mobileNodeDesktop.ts`): `mobile.settings.*`. English is the
source text; `{name}` is a parameter. The surrounding phone texts (menu entries Artifacts, Files, Messages, Activity; the New run labels
Runtime, Model, Choose, Search runtimes/models; Refresh models) are the product's own and keep their existing keys or the ones 509 gives them.

| Key | English | Where | Notes |
| --- | --- | --- | --- |
| `mobile.settings.menuEntry` | Settings | ⋮ menu entry | the screen title is the same word: `mobile.settings.title` = Settings |
| `mobile.settings.runtime` / `mobile.settings.model` | Runtime / Model | row labels | same words as New run: reuse its keys |
| `mobile.settings.runningTitle` | This run is working | card for a running run | |
| `mobile.settings.runningBody` | Stop it to change its runtime and model. Everything in the conversation stays. | same card | |
| `mobile.settings.stopRun` | Stop run | button in that card | |
| `mobile.settings.save` | Save | button | |
| `mobile.settings.savedTitle` | Saved | green card | |
| `mobile.settings.savedBody` | It applies when you send your next message. | green card, the only place the screen says it | |
| `mobile.settings.backToConversation` | Back to the conversation | button in the green card | |
| `mobile.settings.memberNote` | These settings are for {agent} only. Open another member from the run list to change theirs. | under the title of a Team or Org member | |
| `mobile.settings.textSize` | Text size | label in the ⋮ menu above the four steps | |
| `mobile.settings.textSize.small` / `.standard` / `.large` / `.largest` | Small / Standard / Large / Largest | accessible names of the four steps in the menu (the "A" glyphs are not text) | |

Texts that are not the phone's: the node's refusals ("“{model}” is not offered by {runtime} now. Refresh the model list and choose again."
and the others of `run-model-selection-refusal.ts`) come from the node and are shown as the node words them; the 458 requirements say plain
words, so the build decides with 509 whether the node or the phone translates them. 506's conversation has no new phone text: the speaker name line
shows the agent's name (or "You", the existing label).

## Where a Language row would go (not designed now)

The ⋮ menu keeps its bottom block for phone-wide choices: Text size today. When Language arrives (autobyteus-509: System language, English,
Chinese), a Language row ("Language   System language ›", opening the same bottom sheet with the three choices) joins that block above or below
Text size. The Settings screen stays the open run's own (Runtime, Model) and gets nothing phone-wide.
