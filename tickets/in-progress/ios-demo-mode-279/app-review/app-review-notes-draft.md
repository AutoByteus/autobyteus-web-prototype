# App Review Information — notes draft (autobyteus-279, round 4)

Status: **draft for the founder's approval**. Nothing goes to App Store Connect, TestFlight or the App Review thread without his explicit word. Round 2 takes in the Solution Designer's verification (`verdict.md`, answer (c)).

## Notes (paste into App Store Connect › App Review Information › Notes)

> AutoByteus is the iPhone and iPad companion of the AutoByteus desktop app. People run AutoByteus on their own computer to work with AI agents, Teams of agents and Orgs; this app lets them follow and direct that work from their phone or tablet.
>
> Normally the app connects to the user's own computer: the desktop app shows a QR code, and the app's camera scanner reads it and connects. Connecting a computer needs the AutoByteus desktop app and is not part of the demo.
>
> For review, the app has a built-in demo with sample data. It works offline: no account, computer, network or server is needed, and nothing is sent anywhere.
>
> To open the demo, either:
> 1. On the first screen, tap **Try demo**, or
> 2. Tap **Scan** and point the camera at the attached demo QR code (it also opens from the iPhone or iPad Camera app).
>
> In the demo you can:
> - See the run list: agents, Teams and an Org, with the work they delegated, in running, idle and stopped states.
> - Open a run and read its conversation: tool calls, a terminal, file edits, a formatted answer, an image, and messages between agents.
> - Send a message to any agent or Team or Org member: it works (a tool call) and answers with a sample reply. Stop a working agent with the red stop button.
> - Use a run's ⋮ menu: Artifacts and Files (open the sample files and pictures), Messages (between the members of a Team or Org), Activity (background tasks and tool calls), Settings (runtime and model, Save), VNC Viewer (a sample desktop: View only, or tap View only to switch to Control with Keyboard and Clipboard).
> - Change the text size for the whole app: the run list's ⋮ › On this phone › Text size (Standard, Large, Largest).
> - Start a new run with the **+** button and send it a message.
> - Leave the demo: tap **Demo** at the top left, then **Leave demo**.
>
> On iPad in landscape, the run list and the open run show side by side.

**Condition on "It works offline … nothing is sent anywhere" (A-04):** keep this sentence only if the build under review passes engineering's offline check: every icon and asset bundled, and no network request while the demo is open, with the device in airplane mode. Otherwise send the notes without it.

Attachment: `autobyteus-demo-qr-card.png` (the demo QR code with a caption). The plain code is `autobyteus-demo-qr.png`; it holds `autobyteus://demo`.

What makes the app more than a website (Guideline 4.2), for the founder's reference; the notes above already show these parts: the native camera scanner that pairs the app with the user's computer, the system Camera opening the app from a QR code, the offline built-in demo, and the iPad layout.

## Reply in the App Review thread (with the resubmission)

Apple's guideline 2.1(a) allows a built-in demo mode "with prior approval". Sent together with the resubmission (not waiting for an answer before building), for the founder to approve:

> Thank you for the review. AutoByteus connects to the user's own computer, so instead of a demo account we have added a built-in demonstration mode, as your message suggests ("It is also acceptable to include a demonstration mode that exhibits the app's full features and functionality"). It opens from "Try demo" on the first screen, or by scanning the demo QR code attached in the App Review Information, and works offline with sample data. Connecting a real computer needs the AutoByteus desktop app.

## Not in these notes on purpose

- No node address, user name, password or credential: the demo has none.
- No demo video (Apple: "not sufficient").
- No share extension: it is removed from this build (design decision D6), so there is no share-sheet entry to review.
