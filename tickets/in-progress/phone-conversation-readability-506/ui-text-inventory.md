# Phone UI text inventory (autobyteus-506, autobyteus-458) — for translation keys from the start (autobyteus-509)

Draft in the design ticket; it moves into `ui-ux-spec.md` ("UI text") when the founder approves the design. Key names follow the product's
existing phone namespace (`mobile.nodeDesktop.title` in `localization/messages/en/mobileNodeDesktop.ts`): `mobile.settings.*`. English is the
source text; `{name}` is a parameter. The surrounding phone texts (menu entries Artifacts, Files, Messages, Activity; the New run labels
Runtime, Model, Choose, Search runtimes/models; Refresh models) are the product's own and keep their existing keys or the ones 509 gives them.

| Key | English | Where | Notes |
| --- | --- | --- | --- |
| `mobile.settings.menuEntry` | Settings | ⋮ menu entry | the screen title is the same word: `mobile.settings.title` = Settings |
| `mobile.settings.thisRun` | This run | section heading (shown in capitals by style, not in the text) | |
| `mobile.settings.runtime` / `mobile.settings.model` | Runtime / Model | row labels | same words as New run: reuse its keys |
| `mobile.settings.runningTitle` | This run is working | card for a running run | |
| `mobile.settings.runningBody` | Stop it to change its runtime and model. Everything in the conversation stays. | same card | |
| `mobile.settings.stopRun` | Stop run | button in that card | |
| `mobile.settings.limitReached` | Limit reached | mark in a runtime or model list when no reset time is known | |
| `mobile.settings.limitReachedUntil` | Limit reached · back at {time} | same mark with the time | `{time}`: the node's reset time formatted in the app language and the phone's time zone (the fixture's "3:40 pm", "tomorrow 9:00 am" are illustrations) |
| `mobile.settings.currentLimit` | {model} has no usage left. Choose another model to carry on. | note under the rows | no time known |
| `mobile.settings.currentLimitUntil` | {model} has no usage left until {time}. Choose another model to carry on. | same note | |
| `mobile.settings.nextMessage` | A change applies when you send your next message. | note under the rows | |
| `mobile.settings.save` | Save | button | |
| `mobile.settings.savedTitle` | Saved | green card | |
| `mobile.settings.savedBody` | {agent} will use {runtime} · {model} when you send your next message, for example “continue”. | same card | the example word “continue” follows the language of the text |
| `mobile.settings.backToConversation` | Back to the conversation | button in the green card | |
| `mobile.settings.memberNote` | These settings are for {agent} only. Open another member from the run list to change theirs. | under the title of a Team or Org member | |
| `mobile.settings.textSize` | Text size | section heading | |
| `mobile.settings.textSizeHint` | For the conversation of every run on this phone. | under that heading | |
| `mobile.settings.textSize.small` / `.standard` / `.large` / `.largest` | Small / Standard / Large / Largest | step captions (the "A" glyphs are not text) | |
| `mobile.settings.textSizeSample` | The pilot customers get three changes that matter to them, and one date that moved. | sample line in the chosen size | illustrative; any plain sentence of the language |

Texts that are not the phone's: the node's refusals ("“{model}” is not offered by {runtime} now. Refresh the model list and choose again."
and the others of `run-model-selection-refusal.ts`) come from the node and are shown as the node words them; the 458 requirements say plain
words, so the build decides with 509 whether the node or the phone translates them. 506's conversation has no new phone text: the speaker name line
shows the agent's name (or "You", the existing label).

## Where a Language row would go (not designed now)

Settings has two sections today: THIS RUN and TEXT SIZE. When Language arrives (autobyteus-509: System language, English, Chinese), the
second section becomes **On this phone** with two rows: **Language** (a choice row like Runtime/Model: label left, value right, "System
language ›", opening the same bottom sheet with three choices) above **Text size** (the stepped control). Phone-wide settings stay under
the run's settings, never mixed into THIS RUN. No other screen changes.
