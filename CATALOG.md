---
name: infineon-dds-icon-library
description: Authoritative catalog of every icon in the Infineon DDS UI Icon Library (`@infineon/infineon-icons`) — 397 icons across 13 categories, each with metaphor, intended use, search keywords, and explicit "avoid for" rules naming the correct alternative icon. Use when picking, recommending, or auditing an Infineon DDS icon name; when implementing the ifx-icon component; when reviewing a design for icon misuse; or when asked "which DDS icon should I use for X". Trigger on mentions of "DDS icon", "Infineon icon", "icon library", "which icon", "icon for a use case", or any icon name ending in `-16`. Pair with infineon-dds-icon for the ifx-icon component API.
---

# Infineon DDS — Icon Library Catalog

Authoritative catalog of every icon in the Infineon DDS UI Icon Library together with its component description. **397 icons** across 13 categories. Use this catalog to pick the right icon name for `<ifx-icon icon="…">` and to avoid the common confusions called out in **Avoid for**.

## How to pick an icon

1. **Match by use case first**, not by visual look. Scan the **Use for** column of the relevant category.
2. **Read Avoid for** for the candidate icon — it names the conflicting alternative by exact library name, so you do not have to guess.
3. **Keywords** is the search-term column — it mirrors what a user would type when looking for the icon.
4. **All icons in this library are 16px** (`-16` suffix). The naming is kebab-case. Variants:
   - `-f-16` suffix = filled / active state (e.g. `bell-f-16`, `bookmark-f-16`)
   - `-x-16` suffix = strike-through / disabled state (e.g. `bell-x-16`, `video-cam-x-16`)
   - `c-…-16` prefix = circle-enclosed status badges (e.g. `c-info-16`, `c-warning-16`, `c-check-f-16`)
   - `s-…-16` prefix = square-enclosed status badges (e.g. `s-warning-16`)
   - `<verb>-16` = a single / atomic step of that verb (e.g. `skip-16` = advance one item)
   - `<verb>-to-<boundary>-16` = jump to a boundary of a collection (e.g. `skip-to-end-16`, `skip-to-beginning-16`) — different from `<verb>-16`, never a synonym
5. **Social Media icons have no `-16` suffix** (e.g. `facebook`, `linkedin`, `tiktok`).

## Writing component descriptions for new icons

When a new icon is added to the library, write its Figma Component Description in this exact format (American English, plain text, no Markdown, inline bracket style, one blank line between sections):

```
[ METAPHOR ]  <One short sentence describing the visual idea.>

[ USE FOR ]  <Concrete product contexts / actions where it should appear.>

[ KEYWORDS ]  <Comma-separated search terms a user might type.>

[ AVOID FOR ]  <For every confusion case, name the specific conflicting icon by its exact library name (e.g. "use cart-f-16 instead"). Never write vague guidance — always point to the correct alternative.>
```

**Social Media icons skip the METAPHOR section** — match the length of the existing entries (facebook, instagram, youtube) and follow only the three sections USE FOR / KEYWORDS / AVOID FOR.

### Quality checklist (pre-publish)

Before setting a Component Description in Figma, verify **each** of the following. Every past confusion in this library — the `responsive-16` copy-paste from `laptop-16`, the dual-meaning `skip-to-end-16` ("Skip to end / next track") that collided with `skip-16`, the missing `tiktok` — traces back to skipping one of these steps.

1. **Metaphor written from the visual.** Open the rendered icon and describe what you actually see. **Never copy the Metaphor line from another icon** — that was the exact `responsive-16` failure mode. If two icons share a Metaphor line word-for-word, one of them is wrong.
2. **Use For describes exactly one semantic action.** If you find yourself writing `"X / Y"` where X and Y are different concepts (e.g. "Skip to end / next track"), split them — either the concepts belong to two icons, or one description is wrong.
3. **Avoid For names every visually similar icon by exact library name.** Grep the catalog for icons with a similar Metaphor and add reciprocal entries in both directions. Vague guidance ("use a different icon") is never acceptable.
4. **Reverse cross-reference audit.** After adding or changing an icon, check every existing icon whose semantics now overlap and add an Avoid-For entry there too. Example: adding `skip-16` required updating `media-play-16` and `skip-to-end-16` to mention it. Missing this step is how conflicts leak in.
5. **Name matches the naming convention.** A `<verb>-to-<boundary>` name must describe a boundary jump; a bare `<verb>` name must describe a single/atomic action. Do not mix.
6. **Figma is the source of truth.** Write the description in Figma first (on the Component), then sync it into this catalog. Never the other way around.

### Workflow: handling an unclear new icon

When a new icon appears in Figma or a user asks for a description on an existing icon whose intent is unclear, follow this decision procedure. Do **not** freeform-guess a description into Figma — Component Descriptions are versioned design-system documentation, not a scratch file.

1. **Name + visual + naming convention agree** → draft the description, show it to the user in chat first, wait for an explicit go before writing to Figma. Do not silently commit.
2. **Visual and name conflict** (e.g. an icon named `responsive-16` that visually shows a single laptop, or `skip-16` that renders identically to `skip-to-end-16`) → **ask the user which intent is correct** before writing anything. Never guess between conflicting signals.
3. **An existing Figma description looks obviously wrong** (copy-pasted from another icon, contradicts the visual, dual-meaning `X / Y`) → **flag it proactively in chat**, do not just mirror it into this catalog. Silence turns a bug into documented behavior.
4. **The new icon visually collides with an existing one** → name the collision explicitly and ask which of the two takes precedence (or which one should be redesigned). Do not let both quietly coexist — a picker user picks on sight, not on documentation.
5. **Never write to Figma without an explicit user confirmation for that specific write.** Read-only Figma calls (`get_screenshot`, `get_design_context`, `get_metadata`, or inspection scripts via `use_figma`) are always fine. Writes to `component.description` are not.

Shorthand: **clear → propose and wait. Unclear → ask. Wrong → flag.**

## Visual collision policy

Two icons in the library **must differ on all three axes** — visual, name, and semantics. If two icons render visually identically (or near-identically), one is a redesign candidate and must be flagged here until it is resolved. Descriptions alone cannot repair a visual collision — a user picking from a Figma asset panel picks on sight, not on documentation.

### Currently open visual collisions

- **`skip-16` ↔ `skip-to-end-16`** — both render as a right-pointing triangle with a trailing vertical bar. Semantics differ (single step forward vs. jump to end of collection) and their descriptions are disambiguated, but the visuals are indistinguishable in a picker. **`skip-16` is the redesign candidate** — until it receives a distinct glyph, expect the icons to be confused on sight. Track the redesign; don't add further `<verb>-16` icons that share a visual with a `<verb>-to-<boundary>-16` sibling.

## Categories

- [Finance (28)](#finance)
- [Communication (35)](#communication)
- [Date & Time (8)](#date-time)
- [Audio/Video (21)](#audio/video)
- [Hardware (60)](#hardware)
- [Software (16)](#software)
- [Locations (12)](#locations)
- [Social Media (13)](#social-media)
- [Miscellaneous (10)](#miscellaneous)
- [Arrows (24)](#arrows)
- [Text (29)](#text)
- [Interface (A-K) (75)](#interface-a-k)
- [Interface (L-Z) (66)](#interface-l-z)
- [Deprecated](#deprecated)

## Finance (28)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `availability-16` | A container / bin with up and down arrows inside. | Stock availability, item-in-stock indicators, capacity availability, inventory in / out movement. | availability, in stock, capacity, ready, stock movement, inventory. | Successful action — use c-check-16. Confirmed appointment — use calendar-check-16. |
| `bar-graph-16` | Vertical bars of mixed heights (a plain bar chart). | Bar-chart visualizations, categorical comparisons. | bar graph, bar chart, comparison, chart. | Bars forming a linear upward ramp — use bar-graph-linear-16. Bars with a diagonal trend line overlay — use bar-graph-x-16. Pure line trends — use line-graph-16. |
| `bar-graph-linear-16` | Vertical bars whose tops form a linear upward ramp. | Bar charts showing a linear increase, growth-progression visualizations. | bar graph linear, ramp, linear increase, growth bars. | Plain / mixed-height bar chart — use bar-graph-16. Bars with a diagonal trend line overlay — use bar-graph-x-16. Smooth line trend — use line-graph-16. |
| `bar-graph-x-16` | Vertical bars with a diagonal trend line crossing them. | Combined bar-and-trend visualizations — a bar chart with an overlaid growth or forecast line. | bar graph, trend line, combined chart, overlay, forecast. | Plain bar chart — use bar-graph-16. Bars forming a linear ramp without overlay — use bar-graph-linear-16. Pure line chart — use line-graph-16. |
| `card-16` | A plastic card. | Open metaphor for any physical card (credit, ID, membership). Useful as analog counterpart to eID-16. | card, plastic card, credit card, id card, membership. | Electronic / digital ID — use eID-16. Passport — use passport-16. EU citizen card — use euc-16. |
| `cart-16` | A shopping cart silhouette. | Shopping carts, add to cart actions, checkout entry points, e-commerce flows. | cart, shopping cart, basket, buy, purchase, checkout, shop, e-commerce. | Active/filled cart state — use cart-f-16. Order history — use a dedicated order icon. Generic item containers — use box-16. |
| `cart-f-16` | A shopping cart with content (filled state). | Active / non-empty shopping-cart state, items in cart indicators. | cart filled, shopping cart, items added, active cart. | Empty cart — use cart-16. Checkout flow CTA — use cart-16. |
| `chart-16` | A line chart displayed inside a bounded chart area. | Generic chart references, framed chart panels, chart-in-a-card affordances. | chart, generic chart, chart panel, framed chart. | Time-series line trend — use line-graph-16 or multi-line-graph-16. Bar chart — use bar-graph-16. Dashboard — use dashboard-16. The DDS icon library does not currently provide a pie / donut chart icon. |
| `checked-out-other-16` | A document with a checkout marker assigned to another person. | Documents currently signed-out or locked by another user in a signing workflow. | checked out, other, locked, signed out, in progress. | You have checkout — use checked-out-you-16. Generic lock — use lock-16. |
| `checked-out-you-16` | A document with a checkout marker assigned to you. | Documents you are currently editing or have signed-out in a signing workflow. | checked out, you, signed out, document signing, in progress. | Document held by another user — use checked-out-other-16. Generic edit — use editor-16 or pen-16. |
| `coins-16` | Two overlapping coins, the foreground coin showing a Euro sign. | Coin and cash references, micro-payments, savings balances, currency references. | coins, money, cash, savings, currency, euro. | Banknote — use money-16. Reports — use finance-16. Shopping — use cart-16. |
| `css-gid-eu-residence-permit-16` | An EU residence-permit card. | EU residence-permit identification flows, residence-status verification. | residence permit, eu permit, identification. | EU citizen card — use euc-16. Passport — use passport-16. Electronic ID — use eID-16. |
| `eID-16` | An ID card with a person and a wireless / NFC signal. | Electronic ID flows, contactless identification, NFC-enabled ID cards, digital identification, online identity verification. | eid, electronic id, digital identity, nfc, contactless, online verification. | Physical card without contactless capability — use card-16. Passport — use passport-16. EU citizen card — use euc-16. |
| `euc-16` | A European Union Citizen card. | European Union Citizen card references, EU citizen identification flows. | euc, eu citizen, european citizen card, identification. | Generic ID — use card-16. Electronic ID — use eID-16. Residence permit — use css-gid-eu-residence-permit-16. |
| `finance-16` | A document combined with a currency mark. | Finance department references, financial reports, budgeting surfaces. | finance, financial report, budget, accounting. | Single currency value — use money-16 or coins-16. Specific chart — use chart-16 or line-graph-16. |
| `line-graph-16` | A single dotted line trend with peaks and dips. | Single-series line charts, individual KPI time-series. | line graph, trend, time series. | Multi-series — use multi-line-graph-16. Bars — use bar-graph-16. Step chart — use staircase-graph-16. Framed chart panel — use chart-16. |
| `money-16` | Stacked bills / banknotes with a currency sign on top. | Prices, payments, payouts, monetary amounts in summaries. | money, cash, banknotes, bills, currency, payment. | Reports / finance dashboards — use finance-16 or chart-16. Coins specifically — use coins-16. Shopping — use cart-16. |
| `multi-line-graph-16` | Multiple line series overlaid on a chart. | Multi-series line charts, comparing trends across categories. | multi line graph, multi-series, comparison, trends. | Single line — use line-graph-16. Bar comparisons — use bar-graph-16. Framed chart panel — use chart-16. |
| `organigram-16` | A hierarchical tree of person nodes. | Organizational charts, reporting lines, team hierarchies. | organigram, org chart, hierarchy, reporting, team structure. | Single team view — use team-16. File / project tree — use tree-structure-16. Single user — use user-16. |
| `passport-16` | A passport booklet. | Passport references, travel-document identification flows. | passport, travel, identification, document. | Generic ID card — use card-16. EU citizen card — use euc-16. Electronic ID — use eID-16. |
| `poll-16` | A three-bar chart with the middle bar highlighted (outlined). | Polls, voting results, survey-outcome visualizations where one option is featured or the winner. | poll, vote, survey, results, highlighted bar. | Generic bar chart — use bar-graph-16. Framed chart panel — use chart-16. |
| `procurement-16` | A diamond / gem outline. | Procurement workflows, purchase orders, sourcing of high-value assets. | procurement, purchasing, sourcing, order, gem, diamond. | Logistics / shipping — use logistics-16. Cart / checkout — use cart-16. Finance overview — use finance-16. |
| `rate-down-16` | A percentage with a down arrow. | Rate / percentage decreases (interest rate, exchange rate, KPI). | rate down, decrease, percentage down, %. | Time-series trend — use trend-down-16. Plain arrow — use arrow-down-16. |
| `rate-up-16` | A percentage with an up arrow. | Rate / percentage increases (interest rate, exchange rate, KPI). | rate up, increase, percentage up, %. | Time-series trend — use trend-up-16. Plain arrow — use arrow-up-16. |
| `simulation-16` | A smooth S-curve (sigmoid) on a chart axis. | Simulation runs, modeled scenarios, what-if analysis surfaces, sigmoid / logistic trends. | simulation, model, scenario, what-if, s-curve, sigmoid. | SPICE circuit simulation — use spice-16. Chart of actual data — use chart-16. Discrete-step chart — use staircase-graph-16. |
| `staircase-graph-16` | A step chart with a rise, plateau, and drop (a pulse shape). | Step charts, discrete on/off state changes, threshold-based visualizations, pulse indicators. | step chart, discrete steps, plateau, pulse, threshold. | Smooth line — use line-graph-16. Bars — use bar-graph-16. Rising bar ramp — use bar-graph-linear-16. |
| `trend-down-16` | A downward trending arrow. | Downward trends, decline indicators, negative change in time series. | trend down, decline, decrease, negative. | Discrete rate decrease — use rate-down-16. Plain arrow — use arrow-down-16. |
| `trend-up-16` | An upward trending arrow. | Upward trends, growth indicators, positive change in time series. | trend up, growth, increase, positive. | Discrete rate increase — use rate-up-16. Plain arrow — use arrow-up-16. Status indicator — use triangle equivalents. |

## Communication (35)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `address-book-16` | An address-book booklet with tabs. | Address book, contact directory, full-contacts view. | address book, contacts, directory, rolodex. | Single contact — use contact-16. List of users — use list-user-16. Mail inbox — use inbox-16. |
| `archive-16` | A storage box with a downward arrow or tab. | Archiving messages, moving items to long-term storage, archived-folder view. | archive, storage, stored, long-term. | Delete — use delete-16. Folder — use folder-16. Box of items — use box-16. |
| `article-16` | A long-form article page. | Article references, blog posts, long-form editorial content. | article, blog post, editorial, long-form. | Generic document — use file-text-16. Page title (H1) — use heading-1-16. Editor surface — use editor-16. |
| `attachment-16` | A paperclip. | Email attachments, file attachments to messages or records. | attachment, paperclip, file attachment, email attachment. | Generic file — use file-16. Hyperlink — use hyperlink-16 or link-16. |
| `box-16` | An archive box. | General metaphor for archived material or analog documents, storage of records. | box, archive, records, storage, analog documents. | Active archive action — use archive-16. Generic package — use package-16. Briefcase / formal — use briefcase-16. |
| `braille-16` | Braille dot pattern. | Braille support, tactile accessibility indicators, accessible-content markers. | braille, accessibility, tactile, blind support. | Wheelchair access — use wheelchair-16. Audio narration — use audio-description-16. |
| `briefcase-16` | A business briefcase. | Formal documents, professional / business materials, work portfolio. | briefcase, formal documents, work, business, portfolio. | Generic file — use file-16. Generic box — use box-16. Email attachment — use attachment-16. |
| `chat-16` | A rectangular speech bubble with a pointer. | Live chat, two-way messaging, conversation surfaces. | chat, conversation, messaging, dialogue, speech bubble. | Speech bubble with text lines / comment thread — use comment-16. Email — use mail-16. Mobile-specific chat — use mobile-chat-16. |
| `coach-16` | A single person figure with arms outstretched (a coaching stance). | Workshop coach references, business mentorship, training-coach contexts. | coach, mentor, workshop lead, training, guidance. | Generic training program — use training-16. Single user — use user-16. Team — use team-16. |
| `comment-16` | An oval speech bubble containing two horizontal text lines. | Comments, comment threads on content, inline feedback with text preview. | comment, speech bubble, feedback, thread, text. | Live chat (rectangular bubble) — use chat-16. Email — use mail-16. Quotation — use quote-16. |
| `community-16` | Two overlapping person silhouettes (one foreground, one behind). | Community references, forums, social groups, user communities. | community, forum, social group, members. | Team of three — use team-16. Two people side by side — use people-16. Network topology — use network-16. |
| `contact-16` | A phone handset inside a circle. | Single contact entry, contact-by-phone affordances, contact-card display. | contact, phone contact, call contact. | Generic user — use user-16. Address book — use address-book-16. Multiple users — use people-16 or team-16. Plain phone handset — use phone-16. |
| `editor-16` | A pen on a document — editing surface. | Rich-text / WYSIWYG editor surfaces, document editing affordances. | editor, edit document, wysiwyg, writing. | Quick inline edit — use pen-16. List editing — use list-edit-16. Article composition — use article-16. |
| `feedback-support-16` | Two speech bubbles side by side — one with a question mark, one with an exclamation mark. | Feedback or support entry points, contact support CTAs, help + issue-reporting surfaces. | feedback, support, contact us, help chat, question, alert. | FAQ / help only — use question-mark-16. Lifeline / emergency support — use lifebuoy-16. |
| `handshake-16` | Two clasped hands. | Partnerships, agreements, deals, professional collaboration. | handshake, partnership, deal, agreement, collaboration. | Generic team — use team-16. Help / support — use lifebuoy-16. |
| `inbox-16` | An inbox tray. | Inbox views, received-items list, message tray. | inbox, tray, received, messages. | Email composition — use mail-16. Archive — use archive-16. |
| `language-16` | A speech bubble containing three horizontal text lines. | App-wide language picker, multi-language content labels, spoken-language references. | language, locale, multi-language, i18n, spoken. | Translating content inline — use translation-16. Region picker — use globe-16. Live chat speech bubble — use chat-16. Comment bubble with text — use comment-16. |
| `mail-16` | A closed envelope. | Email messages, inbox links, contact-by-email actions. | mail, email, envelope, message, inbox. | In-app chat — use chat-16. Comment thread — use comment-16. Physical shipping — use logistics-16. |
| `megaphone-16` | A megaphone / bullhorn. | Announcements, marketing campaigns, broadcast messages. | megaphone, announcement, broadcast, campaign. | User notification — use bell-16. Speaker / audio — use speaker-16. |
| `mobile-chat-16` | A mobile phone with a chat bubble. | Mobile chat / messaging, SMS, in-app mobile messaging. | mobile chat, sms, messaging, phone chat. | Desktop chat — use chat-16. Email — use mail-16. Comment thread — use comment-16. |
| `people-16` | Two person silhouettes placed side by side. | Multiple users, audience references, "several people" surfaces. | people, group, users, two people. | Team of three — use team-16. Two overlapping people — use community-16. Org chart — use organigram-16. |
| `phone-16` | A phone handset. | Phone references, call-this-number actions, contact-by-phone affordances. | phone, call, telephone, handset. | Active call — use phone-call-16. Mobile chat — use mobile-chat-16. Smartphone device — use smartphone-16. |
| `phone-call-16` | A phone handset with outgoing call lines. | Active phone calls, call-in-progress, dial action with status. | phone call, calling, dial, in call. | Generic phone reference — use phone-16. Mobile messaging — use mobile-chat-16. |
| `reply-16` | A curved arrow returning to a message. | Reply to a message, email reply, response action. | reply, respond, answer, return. | Undo — use curved-arrow-left-16 or restore-16. Send new — use send-16. Forward — different icon. |
| `rss-16` | Radiating signal arcs in a corner. | RSS feed subscriptions, content syndication links. | rss, feed, subscribe, syndication. | WiFi — use wifi-16. Notifications — use bell-16. |
| `send-16` | A paper plane. | Send action — submit a message, send email, dispatch form. | send, submit, dispatch, paper plane. | Share to other apps — use share-16. External link — use launch-16. Forward / reply — use reply-16. |
| `share-16` | Three nodes connected by lines (share graph). | Share content to other apps, social-share trigger, distribute content. | share, social share, distribute. | Send a message — use send-16. External link — use launch-16. Hyperlink — use hyperlink-16. |
| `speaker-16` | A speaker presenting. | Public speaker, presenter, conference-talk references. | speaker, presenter, talk, presentation. | Audio speaker (volume) — use sound-16 or volume-up-16. Megaphone broadcast — use megaphone-16. Training class — use training-16. |
| `team-16` | Three person silhouettes standing close together. | Team views, team workspaces, group memberships. | team, group, three people, team members, workspace. | Two people side by side — use people-16. Two overlapping people — use community-16. Organization hierarchy — use organigram-16. |
| `training-16` | A person with a chalkboard or progress chart. | Training programs, learning sessions, instructor-led courses. | training, course, learning, instructor. | Self-paced eLearning — use elearning-16. Workshop coach — use coach-16. Webinar — use webinar-16. |
| `user-16` | A single person silhouette. | Generic user reference, account profile, single-person indicator. | user, person, profile, account. | Multiple users — use people-16 or team-16. Contact card — use contact-16. HR portal — use my-hr-16. |
| `user-add-16` | A person silhouette with a plus mark. | Add a user, invite member, create-new-user actions. | user add, invite, new user, add member. | Already added — use user-added-16. Pin user — use user-pin-16. Generic add — use plus-16. |
| `user-added-16` | A person silhouette with a check mark. | Confirmed user, successfully added member, verified-membership state. | user added, member confirmed, verified user. | Add action — use user-add-16. Verified entity — use verified-16. Qualified — use qualified-16. |
| `user-pin-16` | A person silhouette with a map pin. | Pinning a user to a location, assigning user to a place, on-site user indicators. | user pin, located user, on site, user location. | Generic location pin — use map-pin-16. User added — use user-added-16. |
| `user-remove-16` | A person silhouette with a minus mark. | Remove a user from a list, group, or organization. | user remove, delete user, remove member. | Add a user — use user-add-16. Generic delete — use delete-16. Block user — use ban-16. |

## Date & Time (8)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `calendar-16` | A calendar rectangle with two small tabs at the top. | Date pickers, scheduled events, deadlines, date columns. | calendar, date, schedule, event, day. | Time of day — use clock-16. Duration — use hourglass-16 or timer-16. |
| `calendar-check-16` | A calendar page marked with a checkmark. | Confirmed appointments, completed events, RSVP-accepted states. | confirmed event, booked, accepted, scheduled, done. | Generic checklists — use check-list-16. Task completion — use c-check-16. |
| `calendar-heart-16` | A calendar page marked with a heart. | Saved or favorite dates, important personal events, anniversaries. | favorite date, anniversary, important date, loved, saved. | Creating a new event — use calendar-plus-16. Confirmed events — use calendar-check-16. |
| `calendar-plus-16` | A calendar page marked with a plus sign. | Creating a new event, adding an entry to a schedule. | add event, new event, create date, schedule entry, plus. | Confirming an existing event — use calendar-check-16. Favoriting a date — use calendar-heart-16. |
| `clock-16` | An analog clock face with hour and minute hands. | Time of day, time selectors, time stamps, opening hours. | clock, time, time of day, hour, minute. | A date — use calendar-16. Elapsed/remaining time — use hourglass-16 or timer-16. Recent activity — use history-16. |
| `history-16` | A clock face with a counter-clockwise arrow. | Activity history, version history, audit logs, recently viewed items. | history, past, log, recent activity, audit, timeline. | Time of day — use clock-16. Waiting state — use hourglass-16. Reverting to a previous state — use restore-16. |
| `hourglass-16` | An hourglass outline. | Waiting states, processing, undetermined duration, "please wait" feedback. | hourglass, wait, loading, pending, processing. | Determinate progress — use progress-bar. Countdown — use timer-16. Historical actions — use history-16. |
| `timer-16` | A round timer with two small tabs at the top corners and a diagonal hand inside. | Countdown timers, kitchen-timer references, time-tracking sessions, scheduled durations. | timer, stopwatch, countdown, duration, time tracking, kitchen timer. | Indeterminate waiting — use hourglass-16. Time of day — use clock-16. Date-based duration — use calendar-16. |

## Audio/Video (21)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `audio-description-16` | The letters "AD" inside a rectangular frame. | Audio-description accessibility tracks, narration for visually impaired users. | audio description, narration, accessibility, blind support. | Braille — use braille-16. Captions — different icon. Wheelchair access — use wheelchair-16. |
| `configure-16` | Three horizontal sliders with round handles. | System-level configuration, technical setup, environment configuration. | configure, setup, system settings, sliders. | User-specific preferences (vertical mixer sliders) — use preferences-16. Generic settings — use cogwheel-16. |
| `headset-16` | Over-ear headphones with a boom microphone (a call-center headset). | Headset / headphones, audio-listening contexts, call-center personas. | headset, headphones, audio listening, call center, boom mic. | Microphone alone — use microphone-16. Speaker output — use sound-16. |
| `media-eject-16` | An upward-pointing triangle with a horizontal bar below (eject symbol). | Eject media, disconnect external drive, "remove safely" actions. | eject, remove media, disconnect drive. | Upload — use upload-16. Stop playback — use media-stop-16. USB remove — use usb-remove-16. |
| `media-pause-16` | Two vertical bars. | Pause playback or recording. | pause, hold, suspend. | Stop — use media-stop-16. Volume bars — different icon. |
| `media-play-16` | A right-pointing triangle outline. | Start or resume playback of audio or video. | play, start, resume, playback. | Submit / send — use send-16. Single forward step — use skip-16. Jump to end — use skip-to-end-16. Triangle navigation — use arrow-triangle-right-16. |
| `media-record-16` | A circle outline. | Start recording (audio or video), record-armed indicator. | record, rec, capture. | Status dot — use dot-16. Bullet point — use bullet-list-16. |
| `media-stop-16` | A square outline. | Stop playback or recording, halt media stream. | stop, halt, media stop. | Pause — use media-pause-16. Eject — use media-eject-16. Block / ban — use ban-16. |
| `microphone-16` | A microphone. | Microphone input, audio recording, voice features. | microphone, mic, voice input, recording. | Speaker output — use sound-16. Recording state — use media-record-16. Public speaker — use speaker-16. |
| `power-16` | A power button. | Power on / off action, shutdown, restart prompts. | power, on off, shutdown, restart. | Standby / sleep — use moon-16. Disconnect / unlink — use unlink-16. |
| `preferences-16` | Two vertical mixer-style sliders with rectangular handles. | User-specific preferences, personalization, profile-level settings. | preferences, personal settings, user settings, mixer sliders, faders. | System-wide configuration (horizontal sliders) — use configure-16. Generic settings — use cogwheel-16. |
| `shuffle-16` | Two crossed arrows (shuffle). | Shuffle playback order, random-play mode. | shuffle, random, mix. | Swap two items — use swap-horizontal-16. Refresh — use refresh-16. |
| `skip-to-beginning-16` | A left-pointing triangle with a leading bar. | Jump to the beginning of a collection or sequence (first track / first item), rewind to start. | skip to beginning, jump to start, first, rewind. | Standard back nav — use arrow-left-16 or chevron-left-16. First page in pagination — use double-chevron-left-16. |
| `skip-to-end-16` | A right-pointing triangle with a trailing bar. | Jump to the end of a collection or sequence (last track / last item), fast-forward to end. | skip to end, jump to end, last, fast forward. | Single forward skip (one item) — use skip-16. Standard next nav — use arrow-right-16 or chevron-right-16. Last page in pagination — use double-chevron-right-16. |
| `sound-16` | A speaker with a single small sound arc. | Generic sound indicator, audio status, audio playback affordances. | sound, audio, speaker. | Volume up (speaker + plus) — use volume-up-16. Volume down (speaker + minus) — use volume-down-16. Mute — use volume-mute-16. Public speaker — use speaker-16. |
| `video-16` | A play triangle inside a circle. | Video files, video content references, embedded video markers. | video, clip, movie, footage, play button. | Video call camera — use video-cam-16. Standalone play control — use media-play-16. |
| `video-cam-16` | A video camera. | Active camera in a video call, video capture, livestream-source indicator. | video cam, camera on, live, video capture. | Disabled — use video-cam-x-16. Generic video content — use video-16. Still-photo camera — use camera-16. |
| `video-cam-x-16` | A video camera with a strike-through. | Video off / disabled state, turn camera off in conferencing UIs. | video off, camera off, no video, disabled. | Active video — use video-cam-16. Generic video file — use video-16. |
| `volume-down-16` | A speaker with a minus mark. | Decrease volume, low-volume indicator. | volume down, low volume, quieter, minus. | Mute — use volume-mute-16. Volume up — use volume-up-16. Generic sound — use sound-16. |
| `volume-mute-16` | A speaker with a strike-through. | Mute action, no-sound state indicator. | volume mute, silent, no sound. | Low volume — use volume-down-16. Disabled — use ban-16. |
| `volume-up-16` | A speaker with a plus mark. | Increase volume, max-volume indicator, sound on / loud state. | volume up, loud, max volume, plus. | Volume down — use volume-down-16. Mute — use volume-mute-16. Generic sound — use sound-16. |

## Hardware (60)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `airplane-16` | An airplane in flight. | Aviation references, air-travel contexts, flight modes. | airplane, plane, flight, aviation. | Rocket / boost — use rocket-16. Satellite — use satelite-16. |
| `antenna-16` | An antenna with radiating waves. | Antenna references, RF / wireless product context, signal-source indicators. | antenna, rf, wireless, broadcast. | WiFi connectivity — use wifi-16. Bluetooth — use bluetooth-16. Generic signal — use waves-16. |
| `assembled-product-16` | An assembled product / system outline. | Infineon product category: assembled / finished products. | assembled product, finished product, system. | Package — use package-16. Module — use module-16. Solution — use solution-16. |
| `battery-charging-16` | A battery with a lightning bolt. | Battery-charging status, charge level + active-charging indicators. | battery charging, battery, charging level. | Generic charging port — use charging-16. Power state — use power-16. |
| `bike-16` | A bicycle. | Bicycle / cycling references, e-bike contexts. | bike, bicycle, cycle, e-bike. | Car — use car-16. Motorbike — different icon. |
| `binoculars-16` | Binoculars. | Search / observation, look ahead, monitoring contexts. | binoculars, observe, look, monitor. | Search input — use search-16. Preview — use preview-16. Glasses — use glasses-16. |
| `board-16` | A printed circuit board. | PCB / development-board references, hardware schematics. | board, pcb, dev board, circuit board. | Single chip — use chip-16. Wafer — use wafer-16. SPICE simulation — use spice-16. |
| `calculator-16` | A calculator. | Calculator tools, numerical-computation entry points. | calculator, math, compute, numbers. | Financial reports — use finance-16. Chart — use chart-16. |
| `camera-16` | A still-photo camera. | Still-photo capture, camera hardware references. | camera, photo, capture, still image. | Video camera — use video-cam-16. Gallery — use gallery-16. Image — use image-16. |
| `car-16` | A passenger car seen from the front (windshield and two headlights). | Automotive references, vehicle products, car-related contexts. | car, vehicle, automotive, auto. | Car headlights specifically — use car-lights-16. Truck / logistics — use logistics-16. Tram — use tram-16. |
| `car-lights-16` | A headlight with rays projecting to the right. | Car-lights references, headlamp-product contexts, automotive lighting. | car lights, headlight, headlamp, rays. | Whole car — use car-16. Generic light — use light-emitting-diode-16. |
| `charging-16` | A two-pin electrical plug going into a socket. | Charging stations, charging-port references, EV-charging contexts. | charging, ev charging, plug, socket, power. | Battery state — use battery-charging-16. Generic power — use power-16. |
| `chemistry-16` | A chemistry flask. | Chemistry / lab contexts, experiments, materials science. | chemistry, lab, flask, experiment. | Cooking / food — use cutlery-16. Tool — use tool-16. Bug / debug — use bug-16. |
| `chip-16` | A square IC package with pins. | Generic semiconductors, processors, IC product references. | chip, ic, semiconductor, processor. | Multiple chips — use chips-16. Through-hole DIP — use chip-dip-16. AI silicon — use chip-AI-16. |
| `chip-AI-16` | An IC chip marked with AI. | AI accelerators, AI / ML silicon products. | chip ai, ai chip, ai silicon, ml accelerator. | AI software / service — use ai-16. AI Label component — for content provenance. |
| `chip-dip-16` | A wide rectangular IC package with pins on the top edge. | DIP-package ICs in through-hole catalogs, legacy components. | chip dip, dual inline package, through-hole, ic. | Surface-mount chip — use chip-16. Multiple chips — use chips-16. |
| `chips-16` | Multiple chips stacked or in a row. | Multiple ICs, chip portfolios, family catalogs. | chips, ics, portfolio, family. | Single chip — use chip-16. Wafer — use wafer-16. |
| `desktop-16` | A desktop tower and monitor. | Desktop-computer device references, workstation targets. | desktop, pc, workstation. | Monitor alone — use desktop-screen-16. Laptop — use laptop-16. Server — use server-16. |
| `desktop-screen-16` | A monitor on a stand. | Desktop monitor / screen references, display-device targets. | desktop screen, monitor, display. | Full desktop computer — use desktop-16. Laptop — use laptop-16. Single window — use windows-16. |
| `eco-mode-16` | A leaf connected to a power plug by a cable. | Eco-mode device toggle, energy-saving operation mode on appliances. | eco mode, energy saving, low power. | Sustainability concept — use leaf-16. Generic power — use power-16. |
| `factory-16` | An industrial factory silhouette. | Manufacturing references, factory locations, production contexts. | factory, manufacturing, production, industrial. | Wafer fab specifically — use wafer-16. Robot / automation — use robotic-arm-16. |
| `fan-1-16` | A fan with the digit "1" beside it. | Lowest fan-speed level (speed 1). | fan, speed 1, low speed. | Medium speed — use fan-2-16. High speed — use fan-3-16. Generic ventilation — use fan-3-16 or thermostat-16. |
| `fan-2-16` | A fan with the digit "2" beside it. | Medium fan-speed level (speed 2). | fan, speed 2, medium speed. | Low — use fan-1-16. High — use fan-3-16. |
| `fan-3-16` | A fan with the digit "3" beside it. | Highest fan-speed level (speed 3). | fan, speed 3, high speed. | Low — use fan-1-16. Medium — use fan-2-16. |
| `generic-diode-16` | A diode schematic symbol. | Generic diode product references, semiconductor diodes. | diode, semiconductor diode, generic diode. | LED — use light-emitting-diode-16. Isolator — use isolator-16. |
| `glasses-16` | Eyeglasses. | Reading view, focus modes, vision-related contexts. | glasses, reading, view, optics. | Observation / monitor — use binoculars-16. Preview — use preview-16. Show / visibility — use show-16. |
| `halogen-free-16` | An Hal symbol with a strike-through. | Halogen-free compliance label on products / packages. | halogen free, compliance. | Lead-free — use lead-free-16. Sustainability — use leaf-16. |
| `high-reliability-16` | A target / bullseye with an arrow hitting the center. | High-reliability product category — components qualified for extreme environments. | high reliability, hi-rel, qualified, rugged, automotive grade, target, precision. | Generic security — use shield-16. Product qualification — use qualified-16. Standard product — use package-16. |
| `isolator-16` | An isolator symbol. | Isolator products (galvanic / digital), isolation contexts. | isolator, isolation, galvanic, digital isolator. | Diode — use generic-diode-16. Transceiver — use transceiver-16. |
| `laptop-16` | An open laptop. | Laptop device references, mobile-computing targets. | laptop, notebook, portable computer. | Desktop computer — use desktop-16. Tablet — use tablet-16. Smartphone — use smartphone-16. |
| `laptop-16-alt` | An open laptop (alternate style). | Laptop device references in newer surfaces — alternate visual. | laptop, notebook, portable computer. | Desktop — use desktop-16. Tablet — use tablet-16. Use the original laptop-16 where the older style is required. |
| `lead-free-16` | A Pb symbol with a strike-through. | Lead-free compliance label on products / packages. | lead free, pb free, rohs, compliance. | Halogen-free — use halogen-free-16. Sustainability — use leaf-16. |
| `light-emitting-diode-16` | A diode schematic symbol inside a circular envelope (LED package). | Light-emitting diode (LED) product references. | led, light-emitting diode, light, diode. | Generic diode — use generic-diode-16. Bulb / lighting UI — different icon. |
| `microcontroller-16` | A microcontroller chip with surrounding pads. | Microcontroller (MCU) references in catalogs, IDE targets, embedded contexts. | microcontroller, mcu, controller, embedded. | Generic IC — use chip-16. AI silicon — use chip-AI-16. Through-hole IC — use chip-dip-16. |
| `microcontroller-erase-16` | A microcontroller with an X mark inside. | Erase-flash operation in MCU programming tools. | microcontroller erase, flash erase, mcu erase. | Generic delete — use delete-16. Program flash — use microcontroller-program-16. |
| `microcontroller-program-16` | A microcontroller with "01" (binary code) inside. | Program / flash an MCU in programming tools. | microcontroller program, flash, mcu program, binary. | Verify only — use microcontroller-verify-16. Erase — use microcontroller-erase-16. |
| `microcontroller-save-16` | A microcontroller with a downward arrow inside. | Save current MCU state / firmware snapshot. | microcontroller save, mcu save, snapshot, download. | Generic save — use floppy-disk-16. Program — use microcontroller-program-16. |
| `microcontroller-verify-16` | A microcontroller with a checkmark. | Verify-flash operation in MCU programming tools. | microcontroller verify, flash verify, mcu verify. | Generic check — use check-16 or c-check-16. Save state — use microcontroller-save-16. |
| `module-16` | A module / sub-assembly outline. | Infineon product category: modules. | module, sub-assembly, infineon product. | Package — use package-16. Solution — use solution-16. Assembled product — use assembled-product-16. Software module — use blocks-16. |
| `package-16` | A semiconductor package outline. | Infineon product category: packaged semiconductors. | package, packaged semiconductor, product. | Module product — use module-16. Solution product — use solution-16. Assembled product — use assembled-product-16. Generic box — use box-16. |
| `robotic-arm-16` | A robotic arm. | Robotics, automation, industrial-arm applications. | robotic arm, robot, automation, industrial. | Generic factory — use factory-16. Tool — use tool-16. |
| `rocket-16` | A rocket launching. | Launch / start-up contexts, growth-acceleration metaphors, boost affordances. | rocket, launch, boost, accelerate. | External link — use launch-16. Satellite — use satelite-16. Airplane — use airplane-16. |
| `satelite-16` | An orbiting satellite. | Satellite references, satellite-communication contexts, space hardware. | satellite, satelite, space, orbit, comms. | Antenna — use antenna-16. Rocket — use rocket-16. |
| `server-16` | A server rack. | Servers, on-prem hardware, datacenter references. | server, datacenter, rack, on-prem. | Cloud service — use cloud-16. Database — use database-16. Desktop computer — use desktop-16. |
| `smartphone-16` | A smartphone outline. | Smartphone device references, mobile-device targets. | smartphone, mobile, phone device. | Phone call — use phone-16 / phone-call-16. Mobile chat — use mobile-chat-16. Tablet — use tablet-16. |
| `software-16` | A laptop with a power symbol on the screen. | Generic software product references, software-package downloads. | software, application, app, program. | Source code — use code-16. App launcher — use applications-16. Executable — use file-exe-16. |
| `solution-16` | A rounded-corner rectangle framed by four corner brackets. | Infineon product category: solutions (multi-component bundles). | solution, product solution, bundle. | Package — use package-16. Module — use module-16. Assembled product — use assembled-product-16. |
| `tablet-16` | A tablet outline. | Tablet device references, mobile-device targets between phone and laptop. | tablet, ipad, slate, mobile device. | Smartphone — use smartphone-16. Laptop — use laptop-16. |
| `technology-16` | Abstract technology / IC representation. | Generic technology references, platform overviews. | technology, tech, platform. | Specific chip — use chip-16. Software — use software-16. AI — use ai-16. |
| `temperature-16` | A thermometer. | Temperature display, thermal-sensor data, temperature-related controls. | temperature, thermometer, thermal. | Cold / freeze — use snow-16. Thermostat device — use thermostat-16. Eco mode — use eco-mode-16. |
| `thermostat-16` | A rectangular digital thermostat with a numeric temperature readout and control buttons. | Smart-thermostat references, HVAC controls, room-temperature setpoints. | thermostat, hvac, temperature control, digital thermostat. | Temperature reading — use temperature-16. Fan speed — use fan-1-16 / fan-2-16 / fan-3-16. |
| `tool-16` | A wrench. | Generic tools, settings, maintenance actions. | tool, wrench, maintenance, settings. | Configuration — use configure-16. Generic settings — use cogwheel-16. User preferences — use preferences-16. |
| `tram-16` | A tram / streetcar. | Tram / streetcar references, public-transport rail contexts. | tram, streetcar, rail, public transport. | Car — use car-16. Train — different icon. |
| `transceiver-16` | A modem-like box with an antenna on top and indicator LEDs. | Transceiver products (CAN / LIN / Ethernet etc.), communication-IC references. | transceiver, can transceiver, comm ic, modem. | Antenna — use antenna-16. Generic chip — use chip-16. |
| `usb-16` | A USB connector. | USB-port references, USB-device connections. | usb, usb port, connector. | USB safely remove — use usb-remove-16. USB switch — use usb-toggle-16. Charging — use charging-16. |
| `usb-remove-16` | A USB connector with an X mark. | Safely remove USB / eject USB device. | usb remove, eject usb, safely remove. | Media eject — use media-eject-16. Plain USB — use usb-16. |
| `usb-toggle-16` | A USB connector with a power symbol. | Toggle USB port on / off, switch between USB modes. | usb toggle, switch usb, usb mode, power. | Plain USB — use usb-16. Safely remove — use usb-remove-16. |
| `wafer-16` | A silicon wafer. | Wafer / fab references, semiconductor-manufacturing contexts. | wafer, fab, silicon, semiconductor manufacturing. | Single chip — use chip-16. Factory — use factory-16. |
| `washing-machine-16` | A washing machine. | Washing-machine / home-appliance references, laundry contexts. | washing machine, laundry, appliance. | Generic device — different icon. Thermostat — use thermostat-16. |
| `webinar-16` | A laptop showing a person's head and shoulders. | Webinars, live online sessions, remote-attendance learning. | webinar, online session, live stream, virtual class. | Self-paced eLearning — use elearning-16. Workshop coach — use coach-16. Classroom training — use training-16. |

## Software (16)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `ai-16` | Two four-pointed sparkle / star shapes. | AI features, AI services, "powered by AI" badges, magical / generative-content markers. | ai, artificial intelligence, machine learning, sparkles, magic. | AI-generated content provenance — use the AI Label component. Smart automation shortcuts — use fairy-wand-16. AI silicon — use chip-AI-16. |
| `applications-16` | Four small application tiles in a 2x2 grid, with one tile rotated 45° as a diamond. | Application launcher, "all apps" overview, installed-apps list. | applications, apps, launcher, tools, tiles. | A single app — use that app's own icon. Software package — use software-16. Hardware module — use module-16. |
| `block-16` | A 3D cube outline (isometric). | A single software abstraction unit, building-block reference. | block, abstraction, unit, building block, cube. | Multiple blocks — use blocks-16. Stacked cards — use layers-16. Hardware module — use module-16. |
| `blocks-16` | Multiple blocks arranged together. | Multiple software abstraction units, modular collections, component palettes. | blocks, modules, components, building blocks. | A single block — use block-16. Stacked layers — use layers-16. Hardware modules — use module-16. |
| `bluetooth-16` | The Bluetooth glyph. | Bluetooth connectivity, pair-device actions, Bluetooth status indicators. | bluetooth, ble, wireless, pair. | WiFi connectivity — use wifi-16. Generic wireless network — use network-16. |
| `bug-16` | An insect silhouette. | Bug reports, defect tracking, debug actions, issue triage. | bug, defect, debug, issue, error. | Generic warning — use warning-16. Error / failure status — use c-warning-16. Critical alert — use warning-critical-16. |
| `cloud-16` | A simple cloud silhouette. | Cloud services, remote storage, online-sync status, cloud-hosted features. | cloud, online, remote, sync, saas. | Two-way transfer — use cloud-upload-download-16. Local server — use server-16. Network topology — use network-16. |
| `cloud-upload-download-16` | A cloud with up and down arrows. | Cloud sync status, two-way cloud transfers, sync activity indicators. | cloud sync, upload, download, transfer. | One-way upload — use upload-16. One-way download — use download-16. Cloud as a service — use cloud-16. |
| `code-16` | Angle brackets enclosing a slash. | Source-code references, code blocks in editors, developer contexts. | code, source, dev, programming. | A source file of a specific language — use file-<lang>-16. Code repository hosting — use github or gitlab. |
| `dashboard-16` | A widget-tile layout inside a frame (two small squares on the left, a tall rectangle on the right). | Dashboards, analytics overviews, KPI summary surfaces. | dashboard, overview, kpi, analytics, widgets, tiles. | A single chart — use chart-16 or a specific bar / line graph icon. App home page — use home-16. |
| `database-16` | A single cylinder. | Database references, persisted data, DB administration surfaces. | database, db, storage, data, cylinder. | Cloud storage — use cloud-16. Local file storage — use folder-16 or floppy-disk-16. Server hardware — use server-16. |
| `globe-16` | A globe with longitude and latitude lines. | Internet, world wide web, international / global scope, region pickers. | globe, world, internet, web, international. | Generic network — use network-16. Language picker — use language-16. |
| `layers-16` | Three overlapping cards / pages stacked diagonally. | Software layers (architecture), z-order stacks, layer panels in design tools. | layers, stack, architecture, z-order, cards. | A single block — use block-16. Multiple 3D cubes — use blocks-16. Project structure — use tree-structure-16. |
| `network-16` | Connected nodes forming a topology. | Network topology references, any-network concept, connected systems. | network, nodes, topology, connection. | Internet broadly — use globe-16. WiFi specifically — use wifi-16. Cloud services — use cloud-16. |
| `spice-16` | A chili pepper (a visual pun on "spice"). | SPICE circuit-simulation tools, simulation results, circuit-analysis features. | spice, simulation, circuit, simulator, chili. | Generic simulation — use simulation-16. Schematic / board reference — use board-16. |
| `wifi-16` | Curved signal arcs radiating upward. | WiFi connectivity, signal strength, network-connection status. | wifi, wireless, signal, network. | Generic network — use network-16. Bluetooth — use bluetooth-16. Internet broadly — use globe-16. |

## Locations (12)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `apartment-building-16` | A multi-story apartment building. | Apartment buildings, residential property listings, urban housing references. | apartment, building, residential, housing, urban. | Generic office building — different icon. Hospital — use hospital-16. Factory — use factory-16. |
| `desk-16` | An office desk with a drawer unit on the right. | Workspace booking, desk-reservation systems, office-layout references. | desk, workspace, office, workstation, booking. | Single person — use user-16. Office building — use apartment-building-16. Generic table — use table-16. |
| `gym-16` | A dumbbell. | Gym locations, fitness facilities, workout / training references. | gym, fitness, workout, dumbbell, training. | Outdoor park — use park-16. Health center — use hospital-16. Body-related metrics — different icon. |
| `hospital-16` | A medical cross inside a square frame. | Hospital locations, medical facilities, healthcare provider references. | hospital, medical, healthcare, clinic, cross. | Patient bed — use hospital-bed-16. First aid / support — use lifebuoy-16. Medical document — use clipboard-medical-16. |
| `hospital-bed-16` | A hospital bed with a medical cross above it. | Inpatient capacity, ward occupancy, hospital-bed availability dashboards. | hospital bed, ward, patient, bed. | Hospital location — use hospital-16. Medical record — use clipboard-medical-16. |
| `logistics-16` | A warehouse and a tall building with a peaked roof. | Logistics, shipping, delivery tracking, supply-chain references, warehouse locations. | logistics, shipping, delivery, supply chain, warehouse. | Order in cart — use cart-16. Generic package — use package-16 or box-16. Procurement process — use procurement-16. |
| `map-pin-16` | A teardrop pin dropped on a map. | Single-location markers, addresses, find on map actions. | location, pin, marker, place, address, map. | Saved favorite location — use pin-16. Navigation routing — different icon. Apartment specifically — use apartment-building-16. |
| `park-16` | A park bench next to a tree. | Park locations, green public spaces, recreational outdoor areas. | park, green space, outdoors, recreation, tree, bench. | Sustainability concept — use leaf-16. Parking action — different icon. Gym — use gym-16. |
| `scale-16` | Lady Justice scales. | Legal references, justice, compliance, balance / fairness concepts. | scale, justice, legal, balance, law, compliance. | Weight measurement — different icon. Sizing controls — use enlarge-16 / maximize-16. Settings balance — use cogwheel-16. |
| `street-view-16` | A person figure standing on an oval base / spotlight. | Street-view exploration, on-the-ground perspective in maps, "you are here" markers. | street view, perspective, exterior, ground view, you are here. | Map marker — use map-pin-16. Bird-eye layout — use layout-16. Building specifically — use apartment-building-16. |
| `waves-16` | Three stacked water waves. | Water, ocean, hydro references, wave patterns. | waves, water, ocean, hydro, wave pattern. | WiFi signal — use wifi-16. Audio playback / sound waves — use sound-16. Audio meter / mic — use microphone-16. |
| `wheelchair-16` | A wheelchair (side view, no person). | Accessibility features, wheelchair access, accessible-route indicators. | wheelchair, accessibility, accessible, mobility. | Audio accessibility — use audio-description-16. Braille — use braille-16. Generic user — use user-16. |

## Social Media (13)

| Icon | Use for | Keywords | Avoid for |
|---|---|---|---|
| `facebook` | Facebook profile/page links, share-to-Facebook actions, sign-in with Facebook. | facebook, meta, social, share, login. | Generic social sharing — use share-16. Other Meta products — use their dedicated icons. |
| `github` | GitHub repository/profile links, source-code references, sign-in with GitHub. | github, git, repository, source code, open source, login. | Alternative Git hosting — use gitlab. Generic source code — use code-16 or a specific file-<lang>-16 icon. |
| `gitlab` | GitLab repository/profile links, source-code references, sign-in with GitLab, CI/CD-pipeline references. | gitlab, git, repository, source code, devops, ci, login. | GitHub-hosted repos — use github. Generic source code — use code-16. |
| `google` | Google brand links, sign-in with Google, Google-service references. | google, login, sign in, account. | Generic search — use search-16. Internet/web references — use globe-16. YouTube specifically — use youtube. |
| `instagram` | Instagram profile links, share-to-Instagram actions, image-feed references. | instagram, social, photos, share, login. | Generic image gallery — use gallery-16 or image-16. Camera — use camera-16. |
| `linkedin` | LinkedIn profile links, share-to-LinkedIn actions, sign-in with LinkedIn, professional-network references. | linkedin, professional, network, share, login. | Generic networking concepts — use network-16. Business contacts — use contact-16 or address-book-16. |
| `tiktok` | TikTok profile links, share-to-TikTok actions, short-video references. | tiktok, social, video, share, login. | Generic video file — use file-mp4-16 or video-16. Audio content — use sound-16. |
| `wechat` | WeChat profile/account links, share-to-WeChat actions, Chinese-market social references. | wechat, weixin, china, social, messaging, share. | Generic chat — use chat-16 or comment-16. Other Chinese platforms — use weibo, zhihu, or youku. |
| `weibo` | Weibo profile/post links, share-to-Weibo actions, Chinese-market microblog references. | weibo, china, social, microblog, share. | Other Chinese platforms — use wechat, zhihu, or youku. Generic social share — use share-16. |
| `xing` | XING profile links, share-to-XING actions, DACH-region professional-network references. | xing, professional, network, dach, share. | International professional network — use linkedin. Generic network — use network-16. |
| `youku` | Youku channel/video links, share-to-Youku actions, Chinese-market video-platform references. | youku, china, video, watch, share. | International video platform — use youtube. Generic video — use video-16. Other Chinese platforms — use weibo, wechat, or zhihu. |
| `youtube` | YouTube channel links, share-to-YouTube actions, embedded-video references. | youtube, video, channel, watch, share. | Generic video file — use file-mp4-16 or video-16. Playback control — use media-play-16. |
| `zhihu` | Zhihu profile/content links, share-to-Zhihu actions, Chinese Q&A-community references. | zhihu, china, qa, knowledge, social. | Generic Q&A — use question-mark-16. Other Chinese platforms — use weibo, wechat, or youku. |

## Miscellaneous (10)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `cutlery-16` | A crossed knife and fork. | Cafeteria menus, food services, meal benefits, restaurant locations. | cutlery, food, meal, restaurant, canteen, dining. | Grocery or produce contexts — use fruit-crate-16. Cooking/lab instructions — use chemistry-16. |
| `fairy-wand-16` | A magic wand with a star tip, surrounded by sparkles. | Smart suggestions, auto-actions, "magic" shortcuts that automate a multi-step task. | magic, wand, star, sparkles, smart, auto, suggest, automate, shortcut. | Labeling AI-generated content — use ai-16 or the AI Label component. Manual configuration — use cogwheel-16. |
| `fruit-crate-16` | A wooden crate filled with fruit. | Grocery and produce contexts, food sourcing, supply-chain food categories. | fruit, produce, grocery, food, crate, supply. | Cafeteria or dining — use cutlery-16. Generic packaging — use box-16. |
| `happy-baby-16` | A smiling baby face. | Family benefits, parental leave, childcare programs, baby-related content in HR or social contexts. | baby, infant, child, family, parental, newborn. | Strollers or baby transport — use stroller-16. General user/person — use user-16. HR portal entry — use my-hr-16. |
| `leaf-16` | A single plant leaf. | Sustainability, environmental programs, green labels, nature-related content. | leaf, eco, sustainability, environment, green, nature. | Power-saving device modes — use eco-mode-16. Halogen/lead-free compliance — use halogen-free-16 or lead-free-16. |
| `my-hr-16` | Two hands from below, each holding a leaf (a "care / growth" gesture). | HR portal entry, employee self-service, personal HR records, benefits and welfare programs. | HR, my HR, human resources, employee portal, self-service, care. | Generic user profile — use user-16. Team or organization view — use team-16 or organigram-16. Sustainability alone — use leaf-16. |
| `present-16` | A wrapped gift box with a ribbon. | Rewards, gifts, employee perks, anniversaries, promotions. | present, gift, reward, bonus, perk, anniversary. | Generic packages or shipping — use box-16 or package-16. Achievements — use award-16 or medal-16. |
| `snow-16` | A snowflake. | Cold-environment device modes, winter-season content, low-temperature alerts, refrigeration. | snow, cold, winter, freeze, low temperature, snowflake. | General temperature display — use temperature-16. Energy-saving device mode — use eco-mode-16. |
| `stroller-16` | A pushchair seen from the side. | Parental leave logistics, baby transport, family-travel info, childcare amenities. | stroller, pushchair, pram, baby transport, parental. | The baby itself — use happy-baby-16. General mobility — use a transport icon such as car-16 or tram-16. |
| `tshirt-16` | A short-sleeved T-shirt silhouette. | Apparel categories, merchandise and swag, dress-code or uniform contexts. | tshirt, apparel, clothing, merchandise, swag, uniform. | Generic gifts or perks — use present-16. Achievements — use award-16 or medal-16. |

## Arrows (24)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `arrow-down-16` | A straight arrow pointing down. | Move down, scroll down, descending order, download direction indicator. | arrow, down, descend, move down. | Collapse / expand menus — use chevron-down-16. Download action — use download-16. |
| `arrow-left-16` | A straight arrow pointing left. | Back navigation, previous step, returning to a prior page or list. | arrow, left, back, previous, return. | Submenu reveal — use chevron-left-16. Jump to start — use skip-to-beginning-16. Undo — use curved-arrow-left-16 or restore-16. |
| `arrow-right-16` | A straight arrow pointing right. | Forward navigation, next step, continue affordances. | arrow, right, next, forward, continue. | Expand submenu — use chevron-right-16. External link — use launch-16. Jump to end — use skip-to-end-16. |
| `arrow-triangle-diagonal-16` | Two solid triangles back-to-back on a diagonal axis. | Resize handles in corners, diagonal expand affordances. | triangle, diagonal, resize, expand, corner. | Standard maximize — use maximize-16 or enlarge-16. Move action — use drag-arrows-16. |
| `arrow-triangle-down-16` | A solid triangle pointing down. | Compact down affordance for dense UI like select dropdowns or table-cell decreases. | triangle, down, dropdown, decrease, indicator. | Standard navigation — use arrow-down-16. Expand / collapse menu — use chevron-down-16. Trend indicators — use trend-down-16 or rate-down-16. |
| `arrow-triangle-horizontal-16` | Two solid triangles back-to-back on a horizontal axis. | Horizontal expand / contract, dual-direction indicators on the x-axis, horizontal resize handles. | triangle, horizontal, expand, two-way, axis. | Swap action — use swap-horizontal-16. Single-direction navigation — use arrow-left-16 or arrow-right-16. |
| `arrow-triangle-left-16` | A solid triangle pointing left. | Compact previous affordance in dense UI, mini carousels, table headers. | triangle, left, previous, indicator. | Standard back navigation — use arrow-left-16. Submenu — use chevron-left-16. |
| `arrow-triangle-right-16` | A solid triangle pointing right. | Compact next affordance, mini carousels, play-like indicators. | triangle, right, next, indicator. | Standard forward navigation — use arrow-right-16. Submenu — use chevron-right-16. Media playback — use media-play-16. |
| `arrow-triangle-up-16` | A solid triangle pointing up. | Compact up affordance for dense UI, table-cell increases, small inline indicators. | triangle, up, increase, indicator. | Standard navigation — use arrow-up-16. Trend indicators — use trend-up-16 or rate-up-16. |
| `arrow-triangle-vertical-16` | Two solid triangles back-to-back on a vertical axis. | Vertical expand / contract, dual-direction indicators on the y-axis, vertical resize handles. | triangle, vertical, expand, two-way, axis. | Swap action — use swap-vertical-16. Single-direction navigation — use arrow-up-16 or arrow-down-16. |
| `arrow-up-16` | A straight arrow pointing up. | Move up, scroll up, ascending order, upload direction indicator. | arrow, up, ascend, move up. | Collapse / expand menus — use chevron-up-16. Upload action — use upload-16. |
| `chevron-down-16` | A caret pointing down. | Expand a section, reveal-more affordance, select-dropdown indicator, sort-descending. | chevron, caret, down, expand, dropdown, descending. | Move-down action — use arrow-down-16. Download — use download-16. |
| `chevron-left-16` | A caret pointing left. | Collapse a submenu, previous slide in a carousel, back within in-page navigation. | chevron, caret, left, collapse, previous. | Cross-page back navigation — use arrow-left-16. Jump to start — use skip-to-beginning-16. |
| `chevron-right-16` | A caret pointing right. | Expand a submenu, breadcrumb separator, more affordance on a row, next slide. | chevron, caret, right, expand, next, breadcrumb. | Cross-page forward navigation — use arrow-right-16. External link — use launch-16. |
| `chevron-up-16` | A caret pointing up. | Collapse a section, hide-more affordance, sort-ascending indicators. | chevron, caret, up, collapse, ascending. | Move-up action — use arrow-up-16. Upload — use upload-16. |
| `corner-arrow-down-right-16` | An arrow that turns at a right angle, pointing down then right. | Sub-action / indented-response indicator, branching flow steps, go into affordances. | corner, arrow, branch, sub-action, indent. | Reply to a message — use reply-16. Standard move action — use arrow-down-16 or arrow-right-16. Nested hierarchy — use tree-structure-16. |
| `curved-arrow-left-16` | A curved arrow turning left (counter-clockwise). | Undo, return-to-previous, counter-clockwise rotate. | curved, undo, return, back, counter-clockwise. | Reply to a message — use reply-16. Full state restore — use restore-16. Standard back navigation — use arrow-left-16. |
| `curved-arrow-right-16` | A curved arrow turning right (clockwise). | Redo, forward action, clockwise rotate. | curved, redo, forward, clockwise. | Share content — use share-16. Reload — use reload-16. Standard forward navigation — use arrow-right-16. |
| `double-chevron-down-16` | Two stacked carets pointing down. | Expand all, jump to bottom, reveal-many affordances. | double chevron, down, expand all, jump to bottom. | Single section — use chevron-down-16. Download — use download-16. |
| `double-chevron-left-16` | Two stacked carets pointing left. | Jump to first page in pagination, skip back, collapse a sidebar. | double chevron, left, first page, skip back. | Single back step — use chevron-left-16 or arrow-left-16. Media skip — use skip-to-beginning-16. |
| `double-chevron-right-16` | Two stacked carets pointing right. | Jump to last page in pagination, skip forward, expand a sidebar. | double chevron, right, last page, skip forward. | Single forward step — use chevron-right-16 or arrow-right-16. Media skip — use skip-to-end-16. |
| `double-chevron-up-16` | Two stacked carets pointing up. | Collapse all, jump to top, hide-many affordances. | double chevron, up, collapse all, jump to top. | Single section — use chevron-up-16. Reset state — use restore-16. |
| `swap-horizontal-16` | Two parallel horizontal arrows stacked — top one pointing left, bottom one pointing right. | Swapping two items on a horizontal axis, exchanging columns, horizontal exchange. | swap, exchange, switch, horizontal, reorder. | Generic refresh — use refresh-16 or reload-16. Drag-reorder handle — use drag-indicator-16. |
| `swap-vertical-16` | Two parallel vertical arrows side by side — left one pointing up, right one pointing down. | Swapping two items on a vertical axis, reordering rows, vertical exchange. | swap, exchange, switch, vertical, reorder. | Sorting — use arrow-up-16 / arrow-down-16 or chevron equivalents. Drag-reorder handle — use drag-indicator-16. |

## Text (29)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `bullet-list-16` | Stacked lines with bullet points. | Bulleted-list affordances, content overview with bullet points. | bullet list, bullets, items. | Rich-text bullet formatting — use unordered-list-16. Numbered list — use ordered-list-16. Plain list — use list-16. |
| `check-list-16` | A list with checkbox squares. | To-do lists, checkbox lists, action-item lists. | checklist, to-do, tasks, checkboxes. | Mark items as completed visually — use list-check-16. Generic list — use list-16. |
| `copyright-16` | The letter C inside a circle. | Copyright marks, legal notices in footers, attribution lines. | copyright, legal, rights, attribution. | Software/document licensing — use license-16. Trademark notice — use a dedicated trademark icon. |
| `hash-mark-16` | The hash (#) character. | Hashtag indicators, numeric prefixes, Markdown heading shortcuts. | hash, hashtag, number, pound. | Tagging system — use tag-16. Sharp-key sound — use sound-16. Article anchors — use hyperlink-16. |
| `heading-1-16` | The letter H paired with the numeral 1. | Applying the top-level heading style in a rich-text editor, marking the main page title. | heading, H1, title, top heading, format. | Other heading levels — use heading-2-16 through heading-6-16. Generic article title — use article-16. |
| `heading-2-16` | The letter H paired with the numeral 2. | Applying second-level heading style for major sections in a rich-text editor. | heading, H2, subheading, section. | Page title — use heading-1-16. Deeper sub-sections — use heading-3-16. |
| `heading-3-16` | The letter H paired with the numeral 3. | Applying third-level heading style for sub-sections in a rich-text editor. | heading, H3, sub-section. | Higher level — use heading-2-16. Lower level — use heading-4-16. |
| `heading-4-16` | The letter H paired with the numeral 4. | Applying fourth-level heading style for nested sub-sections. | heading, H4, nested. | Higher level — use heading-3-16. Lower level — use heading-5-16. |
| `heading-5-16` | The letter H paired with the numeral 5. | Applying fifth-level heading style for deeply nested content. | heading, H5, deep nested. | Higher level — use heading-4-16. Lowest level — use heading-6-16. |
| `heading-6-16` | The letter H paired with the numeral 6. | Applying the deepest heading style in a rich-text editor. | heading, H6, deepest. | Higher level — use heading-5-16. Plain bold text — use text-bold-16. |
| `list-16` | Three stacked list rows, the top one outlined and the bottom two filled. | Generic list view, displaying items in any UI surface. | list, lines, items. | Bulleted formatting — use unordered-list-16 or bullet-list-16. Numbered formatting — use ordered-list-16. To-do — use check-list-16. |
| `list-check-16` | A list with a checkmark. | Mark list items as complete, validated-list states. | list check, completed list, validated. | To-do checkboxes — use check-list-16. Single confirmation — use check-16 or c-check-16. |
| `list-edit-16` | A list with a pencil. | Editing list items, manage-list affordances. | list edit, manage list, edit items. | Add an item — use list-plus-16. Edit free text — use editor-16 or pen-16. |
| `list-plus-16` | A list with a plus sign. | Add a new item to a list. | add to list, list plus, new item. | Generic add — use plus-16. Edit list — use list-edit-16. Mark item complete — use list-check-16. |
| `list-user-16` | A list with a person. | User-assigned lists, contact lists, member lists. | list user, contacts, members. | Single user — use user-16. Team view — use team-16. Address book — use address-book-16. |
| `menu-16` | Three stacked horizontal lines (hamburger). | Main menu trigger on mobile and compact UI, app drawer. | menu, hamburger, navigation, drawer. | Overflow / more actions — use more-16. Settings — use cogwheel-16. 6x6 grid menu — use chocolate-menu-16. |
| `menu-left-16` | Three horizontal lines biased toward the left. | Left-align text formatting in a rich-text editor. | menu left, align left, left justify. | Opening the left sidebar — use sidebar-left-16. Generic menu — use menu-16. |
| `menu-right-16` | Three horizontal lines biased toward the right. | Right-align text formatting in a rich-text editor. | menu right, align right, right justify. | Opening the right sidebar — use sidebar-right-16. Generic menu — use menu-16. |
| `ordered-list-16` | Stacked lines preceded by numerals. | Applying ordered (numbered) list formatting in a rich-text editor. | ordered list, ol, numbered, format. | Bulleted list — use unordered-list-16 or bullet-list-16. Plain list — use list-16. |
| `paragraphs-16` | Two rows, each with a square block on the left and horizontal text lines on the right. | Paragraph-level formatting controls, paragraph style picker in an editor, block-with-text layouts. | paragraph, text block, list with thumbnails. | Article composition surface — use article-16 or editor-16. Full document — use file-text-16. |
| `question-mark-16` | A question mark (?). | Help triggers, FAQ entries, what is this hints. | help, question, faq, hint. | Status info — use c-info-16. Support / lifeline — use lifebuoy-16. Status with circle — use c-question-16. |
| `quote-16` | Two pairs of opening quotation marks side by side. | Block-quote affordance in a rich-text editor, testimonials, quoted text styling. | quote, quotation, testimonial, blockquote. | Inline comments — use comment-16. Speech / chat — use chat-16. |
| `subscript-16` | An X with a small 2 dropped below the baseline. | Applying subscript formatting (chemical formulas, math notation). | subscript, formula, chemistry. | Superscript — use superscript-16. |
| `superscript-16` | An X with a small 2 raised above the baseline. | Applying superscript formatting (exponents, footnote references, ordinals). | superscript, exponent, footnote, X squared. | Subscript — use subscript-16. Standalone footnote indicator — use a dedicated footnote icon. |
| `text-bold-16` | A bold uppercase B. | Applying bold formatting to the selected text in a rich-text editor. | bold, B, strong, format. | Italic emphasis — use text-italic-16. Heading weight — use heading-1-16 through heading-6-16. |
| `text-color-16` | A capital A with an underline bar (representing a color swatch). | Changing the color of selected text in a rich-text editor. | text color, font color, format, color. | Background highlight — use a highlight icon. Theme switch — use cogwheel-16 or moon-16. |
| `text-italic-16` | A slanted lowercase i (with a dot). | Applying italic formatting to the selected text in a rich-text editor. | italic, i, emphasis, format. | Bold weight — use text-bold-16. Quoted block — use quote-16. |
| `translation-16` | A non-Latin character (e.g. 文) next to a Latin letter A. | Translation actions, "translate this", switching content language inline. | translation, translate, language, localization. | App-wide language picker — use language-16. Multi-language label — use language-16. |
| `unordered-list-16` | Stacked lines with bullet points (rich-text style). | Applying unordered (bulleted) list formatting in a rich-text editor. | unordered list, ul, bulleted, format. | Ordered list — use ordered-list-16. Generic display — use list-16 or bullet-list-16. |

## Interface (A-K) (75)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `advanced-16` | A gauge / speedometer with the needle pointing to the high end. | Advanced / level-3 skill or maturity indicator. | advanced, level 3, expert, gauge. | Beginner — use beginner-16. Intermediate — use intermediate-16. |
| `award-16` | A round medal with two ribbons hanging below. | Award, medal, top achievement, prize. | award, medal, ribbon, prize, achievement. | Trophy cup — different icon (not in library). Graduation — use graduation-16. Favorite — use star-16. |
| `ban-16` | A circle with a diagonal line through it. | Blocked / forbidden state, not allowed indicator. | ban, blocked, forbidden, not allowed. | Delete — use delete-16. Mute — use volume-mute-16. Close — use cross-16. |
| `barcode-16` | A barcode. | Barcode references, product / inventory scan affordances. | barcode, scan, inventory. | QR code — use qr-code-16. |
| `beginner-16` | A gauge / speedometer with the needle pointing to the low end. | Beginner / level-1 skill or maturity indicator. | beginner, level 1, novice, gauge. | Intermediate — use intermediate-16. Advanced — use advanced-16. |
| `bell-16` | An outline bell. | Notifications entry, alert / reminder affordance. | bell, notification, alert, reminder. | Active / new notification — use bell-f-16. Muted notifications — use bell-x-16. Announcement — use megaphone-16. |
| `bell-f-16` | A filled bell. | Active or unread notification, current alert state. | bell filled, notification active, unread. | Inactive notifications — use bell-16. Muted — use bell-x-16. |
| `bell-x-16` | A bell with a strike-through. | Muted / disabled notifications, do not disturb. | bell x, muted, dnd, no notifications. | Active notifications — use bell-f-16. Inactive — use bell-16. |
| `book-16` | A closed book. | Reading material references, documentation entries, library views. | book, reading, manual, documentation. | Open book — use book-open-16. With bookmark — use book-bookmark-16. Learning programs — use elearning-16 or training-16. |
| `book-bookmark-16` | A book with a bookmark ribbon. | Saved reading position in a book / document, bookmarked publication. | book bookmark, saved book, reading progress. | Generic bookmark — use bookmark-16. Open book — use book-open-16. |
| `book-open-16` | An open book. | Currently-being-read / open documentation, in-context reading mode. | book open, reading, open manual. | Closed book — use book-16. Article — use article-16. Bookmark — use book-bookmark-16. |
| `bookmark-16` | An outline bookmark ribbon. | Bookmark / save for later (inactive state). | bookmark, save for later. | Active bookmark — use bookmark-f-16. Favorite — use star-16. Tag — use tag-16. |
| `bookmark-f-16` | A filled bookmark ribbon. | Currently bookmarked state — item is saved for later. | bookmark filled, bookmarked, saved. | Inactive bookmark — use bookmark-16. Favorite — use star-f-16. Book with marker — use book-bookmark-16. |
| `c-add-16` | A plus inside an outline circle. | Add affordance in compact status / list contexts. | c-add, circle add, plus circle. | Plain add — use plus-16. Emphasized state — use c-add-f-16. Add to list — use list-plus-16. |
| `c-add-f-16` | A plus inside a filled circle. | Emphasized add affordance / primary add-button glyph. | c-add filled, primary add. | Outline state — use c-add-16. Plain add — use plus-16. |
| `c-check-16` | A check inside an outline circle. | Success / confirmation status (inline marker). | c-check, circle check, confirmed, success. | Emphasized — use c-check-f-16. Plain check — use check-16. Mark list done — use list-check-16. |
| `c-check-f-16` | A check inside a filled circle. | Emphasized success / strong-confirmation state. | c-check filled, strong success. | Outline — use c-check-16. Plain check — use check-16. |
| `c-delete-16` | A trash icon inside an outline circle. | Delete affordance in compact status surfaces. | c-delete, circle delete. | Emphasized state — use c-delete-f-16. Plain delete — use delete-16. Remove (X) — use c-remove-16. |
| `c-delete-f-16` | A trash icon inside a filled circle. | Emphasized delete affordance in compact status surfaces. | c-delete filled, emphasized delete. | Outline — use c-delete-16. Plain delete — use delete-16. |
| `c-info-16` | An i inside an outline circle. | Inline informational status / info hint. | c-info, circle info, information, hint. | Emphasized — use c-info-f-16. Help question — use question-mark-16 or c-question-16. |
| `c-info-f-16` | An i inside a filled circle. | Emphasized informational status, primary info badge. | c-info filled, emphasized info. | Outline — use c-info-16. Help — use c-question-16. |
| `c-question-16` | A question mark inside an outline circle. | Inline help affordance, unknown status indicator. | c-question, circle question, help, unknown. | Emphasized — use c-question-f-16. Plain ? — use question-mark-16. Info — use c-info-16. |
| `c-question-f-16` | A question mark inside a filled circle. | Emphasized help / unknown-status badge. | c-question filled, emphasized help. | Outline — use c-question-16. Plain ? — use question-mark-16. |
| `c-remove-16` | An X inside an outline circle. | Remove / close affordance, error status (inline). | c-remove, circle x, remove, close. | Emphasized — use c-remove-f-16. Plain X — use cross-16. Delete to trash — use delete-16 or c-delete-16. |
| `c-remove-f-16` | An X inside a filled circle. | Emphasized remove / error state. | c-remove filled, emphasized close, error. | Outline — use c-remove-16. Plain X — use cross-16. |
| `c-warning-16` | An exclamation mark inside an outline circle. | Inline warning status / caution badge. | c-warning, circle warning, caution. | Emphasized — use c-warning-f-16. Triangle warning — use warning-16. Square warning — use s-warning-16. |
| `c-warning-f-16` | An exclamation mark inside a filled circle. | Emphasized warning / strong-caution badge. | c-warning filled, emphasized warning. | Outline — use c-warning-16. Triangle — use warning-16. Critical — use warning-critical-16. |
| `change-status-16` | Three stacked status boxes / pills connected in a flow. | Open metaphor for any status change (system, user, order, etc.). | change status, status change, switch state, workflow. | Specific state toggle — use a dedicated icon. Refresh — use refresh-16. Swap — use swap-vertical-16 or swap-horizontal-16. |
| `check-16` | A checkmark. | Confirm / success affordance, done marker. | check, tick, done, success. | Inline circle — use c-check-16. Verified entity — use verified-16. Confirmed event — use calendar-check-16. |
| `chocolate-menu-16` | A 3x3 grid of outlined tiles. | Chocolate-menu launcher — grid of CTAs / tiles (default state). | chocolate menu, app grid, tile menu, launcher. | Burger menu — use menu-16. Overflow menu — use more-16. Active chocolate menu — use chocolate-menu-active-16. |
| `chocolate-menu-active-16` | A 3x3 grid of filled tiles. | Chocolate-menu launcher in opened / active state. | chocolate menu active, app grid open, opened launcher. | Default state — use chocolate-menu-16. Burger menu — use menu-16. |
| `clipboard-16` | A clipboard with two horizontal text lines. | Generic clipboard, task list on a board, paste destination. | clipboard, board, task list. | Verified / checked clipboard — use clipboard-check-16. Medical — use clipboard-medical-16. Copy action — use copy-16. |
| `clipboard-check-16` | A clipboard with a checkmark. | Verified / completed clipboard tasks, audit-passed records. | clipboard check, verified, completed. | Generic clipboard — use clipboard-16. Single confirmation — use c-check-16. |
| `clipboard-medical-16` | A clipboard with a medical cross. | Medical records, patient charts, clinical-form references. | clipboard medical, patient chart, medical record. | Hospital location — use hospital-16. Generic clipboard — use clipboard-16. |
| `cogwheel-16` | A cogwheel / gear. | Generic settings entry point, configuration access. | settings, gear, cog, configuration. | User-specific preferences — use preferences-16. System configuration — use configure-16. Tool — use tool-16. |
| `collapse-16` | Two chevrons pointing toward each other on a vertical axis. | Collapse a content block vertically, shrink an expanded section back to its header, hide details in a panel. | collapse, minimize section, hide details, shrink, close panel. | Expand — use expand-16. Single-section collapse arrow — use chevron-up-16. Collapse-all list — use double-chevron-up-16. Minimize window — use maximize-16. |
| `copy-16` | Two overlapping document pages. | Copy content to clipboard for later paste. | copy, clipboard copy, duplicate to clipboard. | Direct duplicate next to original — use duplicate-16. Cut — use scissors-16. |
| `cross-16` | An X / cross. | Close / dismiss / cancel affordance. | cross, x, close, dismiss, cancel. | Inline circle — use c-remove-16. Permanent delete — use delete-forever-16. Block — use ban-16. |
| `delete-16` | A trash bin. | Delete / move to trash, soft-delete action. | delete, trash, remove. | Permanent delete — use delete-forever-16. Delete text — use delete-text-16. Remove user — use user-remove-16. |
| `delete-forever-16` | A trash bin with a strike-through or X. | Permanently delete content / empty trash with no recovery. | delete forever, permanent delete, purge. | Soft delete — use delete-16. Cancel action — use cross-16. |
| `delete-text-16` | A backspace-key shape with an X inside. | Backspace / delete text-character action in an editor. | delete text, backspace, erase text. | Delete file — use delete-16. Permanent — use delete-forever-16. |
| `dot-16` | A small filled dot. | Generic status dot, unread indicator, list bullet placeholder. | dot, status dot, bullet, unread. | Record action — use media-record-16. Three-dot menu — use more-16. Indicator — use the Indicator component. |
| `download-16` | An arrow descending into a tray. | Download a file or content to local device. | download, save file, fetch. | Cloud sync — use cloud-upload-download-16. Already downloaded — use download-check-16. Add new download — use download-plus-16. |
| `download-check-16` | A download tray with a checkmark above. | Completed download / successfully fetched item. | download check, downloaded, complete. | Generic download — use download-16. Add new — use download-plus-16. |
| `download-plus-16` | A download tray with a plus above. | Add a new download / start additional download. | download plus, add download, new download. | Single download — use download-16. Completed — use download-check-16. Generic add — use plus-16. |
| `drag-arrows-16` | Four-directional arrows. | Free-move / drag-to-position affordance for objects. | drag arrows, move, reposition, four-way move. | Reorder list — use drag-indicator-16. Diagonal resize — use arrow-triangle-diagonal-16. |
| `drag-indicator-16` | Two columns of dots (drag handle). | Drag handle for reordering rows / items in a list. | drag indicator, drag handle, reorder. | Move freely — use drag-arrows-16. Swap two items — use swap-vertical-16 / swap-horizontal-16. |
| `duplicate-16` | Two overlapping circles — one duplicated behind another. | Duplicate an object — direct copy placed adjacent to the original. | duplicate, dup, instant copy. | Copy to clipboard — use copy-16. Add new item — use plus-16. List duplicate — use list-plus-16. |
| `elearning-16` | An open book (spread view). | Self-paced eLearning, online courses, learning-platform entries, reading-based learning. | elearning, online course, self-paced learning, open book. | Instructor-led training — use training-16. Workshop coach — use coach-16. Webinar — use webinar-16. Closed book — use book-16. |
| `enlarge-16` | Outward arrows pushing apart content. | Enlarge content within the same window, expand object size. | enlarge, expand, grow. | Maximize window — use maximize-16. Zoom in — use zoom-in-16. Diagonal resize handle — use arrow-triangle-diagonal-16. |
| `expand-16` | Two chevrons pointing away from each other on a vertical axis. | Expand a content block vertically, reveal full content of a collapsed section, show more in an accordion panel. | expand, enlarge section, show details, open panel, grow. | Collapse — use collapse-16. Single-section expand arrow — use chevron-down-16. Expand-all list — use double-chevron-down-16. Enlarge object — use enlarge-16. Diagonal resize handle — use arrow-triangle-diagonal-16. |
| `filter-16` | A funnel filter. | Filter affordance — apply or clear filter criteria. | filter, funnel, refine. | Active filter — use filter-active-16. Search — use search-16. Sort — use arrow-up/down-16. |
| `filter-active-16` | A solid / filled funnel filter. | Active filter state — filter criteria currently applied. | filter active, applied filter, filtered. | Inactive filter — use filter-16. Refresh — use refresh-16. |
| `firewall-16` | A shield with a flame inside. | Firewall configuration, network-security firewall references. | firewall, network security, perimeter, shield, flame. | Generic security — use shield-16. Shield settings — use shield-settings-16. Protected state — use protection-16. |
| `flag-16` | An outline flag on a pole. | Flag content for review, mark for follow-up (inactive). | flag, mark, follow up, report. | Active flag — use flag-f-16. Country / language — use globe-16 or language-16. |
| `flag-f-16` | A filled flag on a pole. | Flagged / currently-flagged state for content. | flag filled, flagged, active flag. | Inactive flag — use flag-16. Reported issue — use bug-16. |
| `floppy-disk-16` | A floppy disk. | Save action, save-to-disk affordance. | save, floppy disk, disk save. | Multiple saved files — use floppy-disks-16. Cloud sync — use cloud-upload-download-16. Database — use database-16. |
| `floppy-disks-16` | Stacked floppy disks. | Save-all / save multiple, batch-save affordance. | floppy disks, save all, multiple saves. | Single save — use floppy-disk-16. Backup / archive — use archive-16. |
| `folder-16` | A folder. | Generic folder reference, file container. | folder, directory, container. | Empty folder — use folder-empty-16. Open folder — use folder-open-16. Project — use project-16. |
| `folder-add-16` | A folder with a plus. | Create a new folder. | folder add, new folder, create folder. | Existing folder — use folder-16. Remove folder — use folder-remove-16. Generic add — use plus-16. |
| `folder-empty-16` | A folder with an X mark in a circle. | Empty-folder / no-content-folder state, invalid folder indicator. | folder empty, no files, empty state, invalid folder. | Folder with content — use folder-16. Remove folder — use folder-remove-16. Open folder — use folder-open-16. |
| `folder-open-16` | An opened folder showing contents. | Open / expanded folder state, browsing-inside-folder views. | folder open, opened, browsing. | Closed folder — use folder-16. Empty folder — use folder-empty-16. |
| `folder-remove-16` | A folder with a minus / X. | Remove or delete a folder. | folder remove, delete folder. | Add folder — use folder-add-16. Delete file — use delete-16. |
| `gallery-16` | A 2x2 grid of empty squares. | Gallery view of media (images, videos), photo / asset galleries. | gallery, media gallery, tiles. | Single image — use image-16. Generic grid — use grid-16. Table — use table-16. |
| `graduation-16` | A graduation cap. | Education achievements, graduation milestones, academic content. | graduation, cap, education, degree. | Award / honor — use award-16. Medal — use medal-16. Course / training — use training-16 / elearning-16. |
| `grid-16` | A simple grid of squares. | Generic grid display, alignment grid, grid view of items. | grid, grid view, tiles. | Layout grid in design — use grid-layout-16. Gallery thumbnails — use gallery-16. Table — use table-16. |
| `grid-layout-16` | A grid with layout regions. | Grid-layout settings in design / CMS tools. | grid layout, css grid, layout grid. | Generic grid — use grid-16. Layout in general — use layout-16. Table — use table-16. |
| `group-16` | A small square nested inside a larger square (grouped shapes). | Group selected objects in a design tool. | group, combine, group objects. | Ungroup — use ungroup-16. Link items — use link-16. People group — use team-16 or people-16. |
| `hide-16` | A crossed-out eye. | Hide content, toggle visibility off. | hide, hidden, eye off, invisible. | Show — use show-16. Preview — use preview-16. |
| `home-16` | A house outline. | App home / start page, dashboard root link. | home, start, house, main page. | Real estate — use apartment-building-16. Dashboard surface — use dashboard-16. HR portal — use my-hr-16. |
| `hyperlink-16` | Two overlapping chain-link rectangles. | Hyperlink to a URL or external resource (web links). | hyperlink, url, web link, chain link. | Internal link — use link-16. Launch in new tab — use launch-16. Hashtag — use hash-mark-16. |
| `image-16` | A picture frame with mountains. | Generic image references, image content, photo placeholders. | image, picture, photo. | Image gallery — use gallery-16. Camera — use camera-16. File of a format — use file-jpg-16 / file-png-16. |
| `insurance-16` | A shield with a cross-shaped pattern inside (coat-of-arms style). | Insurance, coverage, protection plans. | insurance, coverage, protection plan, shield. | Generic security — use shield-16. Lifeline / support — use lifebuoy-16. Firewall — use firewall-16. |
| `intermediate-16` | A gauge / speedometer with the needle pointing straight up (mid position). | Intermediate / level-2 skill or maturity indicator. | intermediate, level 2, gauge. | Beginner — use beginner-16. Advanced — use advanced-16. |
| `key-16` | A key. | Access credentials, API keys, authorization keys. | key, credential, api key, access. | Generic lock — use lock-16. Login flow — use logout-16 (mirror). Authentication settings — use shield-settings-16. |

## Interface (L-Z) (66)

| Icon | Metaphor | Use for | Keywords | Avoid for |
|---|---|---|---|---|
| `launch-16` | An arrow pointing diagonally up-right out of a box. | Open in new window / external link to another app. | launch, open, external link, new window. | Hyperlink to URL — use hyperlink-16. Rocket / boost metaphor — use rocket-16. |
| `layout-16` | A page layout outline. | Layout settings, page-layout picker, layout-style choice. | layout, page layout, format. | Grid display — use grid-16. Grid-layout settings — use grid-layout-16. Gallery — use gallery-16. |
| `lifebuoy-16` | A lifebuoy ring. | Support / help center entry, urgent-help affordance. | lifebuoy, support, help center, rescue. | FAQ — use question-mark-16. Contact form — use feedback-support-16. Insurance — use insurance-16. |
| `link-16` | An interlinked chain. | Internal link / linked reference, link two resources. | link, chain, internal link. | External web URL — use hyperlink-16. Launch in new tab — use launch-16. Unlink — use unlink-16. |
| `lock-16` | A padlock outline (closed). | Locked state, lock this, protected-content marker. | lock, locked, protect. | Filled emphasis — use lock-f-16. Unlocked — use unlocked-16. Security overall — use shield-16. |
| `lock-f-16` | A filled / solid padlock. | Strongly indicate locked / protected state in compact UI. | lock filled, locked, secure. | Outline lock — use lock-16. Unlocked — use unlocked-16. |
| `logout-16` | A door with an out-arrow. | Sign-out / log-out action. | logout, sign out, exit. | Unlink — use unlink-16. Power off — use power-16. Unlock — use unlocked-16. |
| `maximize-16` | A square with a smaller square in the corner and an arrow pointing diagonally out. | Maximize a window / panel to full screen. | maximize, full screen, expand window. | Enlarge content — use enlarge-16. Zoom in — use zoom-in-16. Diagonal resize — use arrow-triangle-diagonal-16. |
| `medal-16` | A round medal hanging on a V-shaped ribbon. | Medal-based achievement, recognition, ranking awards. | medal, ribbon, achievement, recognition, ranking. | Trophy-style award — use award-16. Education — use graduation-16. Favorite — use star-16. |
| `minus-16` | A minus sign. | Generic remove / decrease affordance. | minus, subtract, remove. | Remove with circle — use c-remove-16. Delete — use delete-16. Collapse — use chevron-up-16. |
| `moon-16` | An outline crescent moon. | Dark-mode toggle (inactive state) — switch to dark theme. | moon, dark mode, night, theme toggle. | Active dark mode — use moon-filled-16. Power / sleep — use power-16. |
| `moon-filled-16` | A filled crescent moon. | Dark-mode toggle (active state) — dark theme currently active. | moon filled, dark mode active, night theme on. | Inactive dark mode — use moon-16. Generic theme settings — use cogwheel-16. |
| `more-16` | Three horizontal dots. | Overflow / more menu trigger (three-dot menu). | more, overflow, three dots, kebab. | Hamburger menu — use menu-16. Settings — use cogwheel-16. Generic dot — use dot-16. |
| `mouse-cursor-16` | A standard arrow cursor. | Default mouse-cursor reference, select tool affordances. | cursor, mouse, arrow cursor, select. | Pointer cursor — use mouse-cursor-pointer-16. Text cursor — use mouse-cursor-text-16. |
| `mouse-cursor-pointer-16` | A pointing-hand cursor. | Hover / clickable affordance cursor states. | pointer cursor, hand cursor, clickable. | Default arrow cursor — use mouse-cursor-16. Text cursor — use mouse-cursor-text-16. |
| `mouse-cursor-text-16` | An I-beam text cursor. | Text-input cursor states, text-tool selection in design contexts. | text cursor, i-beam, text input cursor. | Pointer cursor — use mouse-cursor-pointer-16. Default arrow cursor — use mouse-cursor-16. |
| `pen-16` | A pen / pencil. | Quick inline edit affordance, edit this pencil action. | pen, pencil, edit, write. | Full editor surface — use editor-16. Edit list items — use list-edit-16. |
| `pin-16` | An outline pushpin. | Pin an item, mark to keep on top / save its position. | pin, pushpin, save position. | Pinned active — use pin-f-16. Location pin — use map-pin-16. User pin — use user-pin-16. |
| `pin-f-16` | A filled pushpin. | Currently pinned state — the item is held at top / saved location. | pin filled, pinned, saved. | Inactive pin — use pin-16. Location pin — use map-pin-16. Favorite — use star-f-16. |
| `plus-16` | A plus sign. | Generic add / create affordance. | plus, add, create. | Add inside circle — use c-add-16. Add to list — use list-plus-16. Add download — use download-plus-16. |
| `preview-16` | An eye framed by four corner brackets (scan-target). | Preview mode for content, preview-before-publish affordances. | preview, preview mode, view before publish. | Toggle visibility — use show-16 / hide-16. Glasses — use glasses-16. |
| `printer-16` | A printer. | Print action, print-preview entry, print-queue references. | printer, print, hard copy. | Document — use file-16. Save — use floppy-disk-16. |
| `project-16` | A trapezoid / bucket shape with a bar above. | Projects, project workspace, project-overview entries. | project, workspace, initiative, bucket. | Plain folder — use folder-16. Tasks — use check-list-16. |
| `protection-16` | A shield with a padlock inside. | Currently-protected state, "you are safe" indicator, locked / protected security. | protection, protected, secure state, shield, lock. | Generic security — use shield-16. Firewall — use firewall-16. Verified — use verified-16. |
| `qr-code-16` | A QR code. | QR-code references, scan-to-link affordances, mobile-pairing prompts. | qr code, scan, mobile link. | Barcode — use barcode-16. |
| `qualified-16` | A checkmark inside a circle with two ribbons hanging below (a certification badge). | Open metaphor for any context with a qualification process — person, product, etc. | qualified, qualification, certified, badge, ribbon. | Verified entity — use verified-16. License — use license-16. Award — use award-16. |
| `refresh-16` | A single circular arrow. | Refresh / reload a partial area (table, widget, section). | refresh, partial reload, update. | Full view reload — use reload-16. Automated — use reload-auto-16. Sync — use cloud-upload-download-16. |
| `reload-16` | Two arrows in a full loop (a refresh swirl). | Reload a complete view / page. | reload, full reload, refetch view. | Partial refresh — use refresh-16. Automated reload — use reload-auto-16. Restore previous — use restore-16. |
| `reload-auto-16` | A reload arrow with an automation mark. | Automated reload — scheduled or triggered refresh of a view. | reload auto, automatic reload, scheduled refresh. | Manual full reload — use reload-16. Manual partial refresh — use refresh-16. |
| `restore-16` | A curved arrow that returns to its starting point. | Restore a previous state (undo all, revert version). | restore, revert, undo state, previous version. | Reload full view — use reload-16. Refresh partial — use refresh-16. History list — use history-16. |
| `responsive-16` | A larger screen overlapping with a smaller mobile device. | Responsive-design references, multi-device previews, breakpoint switchers, content that adapts across viewport sizes. | responsive, responsive design, multi-device, breakpoints, viewports, adaptive layout. | Single device — use desktop-screen-16, laptop-16, tablet-16, or smartphone-16. Layout settings — use layout-16. Window arrangement — use windows-16. |
| `s-warning-16` | An exclamation mark inside a square. | Square-style warning badge — alternative to circle / triangle in compact UI. | s-warning, square warning, caution square. | Standard warning — use warning-16. Inline circle — use c-warning-16. Critical — use warning-critical-16. |
| `sad-16` | A sad face. | Negative sentiment, unhappy state, dissatisfaction surveys. | sad, unhappy, dissatisfied, negative. | Positive — use smile-16. Disapproval — use thumb-down-16. |
| `sample-16` | A magnifying glass inside a rectangular frame. | Product samples, request-a-sample actions, sample-product references, sample-picking flows. | sample, product sample, request sample, magnifier. | Search input — use search-16. Zoom in — use zoom-in-16. Generic box — use box-16. |
| `scissors-16` | An open pair of scissors. | Cut content to clipboard, trim / cut affordances. | scissors, cut, trim. | Delete content — use delete-16. Copy — use copy-16. |
| `search-16` | A magnifying glass. | Search input trigger, search action, filter-by-query affordance. | search, find, magnifier, lookup. | Zoom in — use zoom-in-16. Zoom out — use zoom-out-16. Filter — use filter-16. |
| `shield-16` | A shield. | General security metaphor, security section, protection-related surfaces. | shield, security, protect. | Protected-state indicator — use protection-16. Firewall specifically — use firewall-16. Insurance — use insurance-16. Shield settings — use shield-settings-16. |
| `shield-settings-16` | A shield with a gear. | Configure / customize security shield settings. | shield settings, security settings, configure security. | Generic settings — use cogwheel-16. Firewall — use firewall-16. Shield generic — use shield-16. |
| `show-16` | An open eye. | Show / reveal content, toggle visibility on. | show, visible, eye, reveal. | Hide — use hide-16. Preview mode — use preview-16. Reading view — use glasses-16. |
| `sidebar-left-16` | A panel docked on the left. | Toggle left-side sidebar / navigation panel. | sidebar left, left panel, nav drawer. | Right sidebar — use sidebar-right-16. Left-align text — use menu-left-16. |
| `sidebar-right-16` | A panel docked on the right. | Toggle right-side sidebar / inspector panel. | sidebar right, right panel, inspector. | Left sidebar — use sidebar-left-16. Right-align text — use menu-right-16. |
| `skip-16` | A right-pointing triangle followed by a vertical bar. | A single forward skip — advance by one item in a collection or sequence. | skip, single skip, skip forward, next, one step forward. | Jump to the end of the entire collection — use skip-to-end-16. Jump to the beginning of the entire collection — use skip-to-beginning-16. Standard next / continue navigation — use arrow-right-16 or chevron-right-16. Media play — use media-play-16. |
| `smile-16` | A smiling face. | Positive sentiment, happy state, satisfaction surveys. | smile, happy, satisfied, positive. | Negative sentiment — use sad-16. Approval — use thumb-up-16. |
| `split-view-16` | A frame with a header row on top and two panes below it. | Split-view layouts, side-by-side comparison surfaces. | split view, side by side, two panes. | Sidebar — use sidebar-left-16 / sidebar-right-16. Multi-window — use windows-16. |
| `star-16` | An outline star. | Mark as favorite / star an item (inactive state). | star, favorite, rate. | Active favorited — use star-f-16. Bookmark — use bookmark-16. Award — use award-16. |
| `star-f-16` | A filled star. | Active favorited state, currently-starred items. | star filled, favorite, starred. | Inactive favorite — use star-16. Pinned item — use pin-f-16. Bookmark — use bookmark-f-16. |
| `table-16` | A table grid. | Tabular data display, view as table, spreadsheet UIs. | table, grid, rows, columns, spreadsheet. | CSV file — use file-csv-16. Generic grid — use grid-16. Card view — use card icons. |
| `table-x-16` | A table with a strike-through. | Remove or disable a table, hide-table action. | table x, delete table, no table. | Generic delete — use delete-16. Hide content — use hide-16. |
| `tag-16` | A price tag with a hole. | Tags / labels on content, taxonomy markers. | tag, label, taxonomy. | Hashtag — use hash-mark-16. Bookmark — use bookmark-16. Status pill — use the Status component. |
| `thumb-down-16` | A thumbs-down hand. | Negative feedback, dislike, disapproval. | thumb down, dislike, disapprove, negative. | Positive — use thumb-up-16. Sad face — use sad-16. Block — use ban-16. |
| `thumb-up-16` | A thumbs-up hand. | Positive feedback, like, approval. | thumb up, like, approve, positive. | Negative — use thumb-down-16. Happy face — use smile-16. Favorite — use star-16. |
| `tree-structure-16` | A branching tree of nodes. | Tree-structure / hierarchy views, file tree, org tree. | tree structure, hierarchy, file tree, nested. | Org chart — use organigram-16. Layers — use layers-16. Nested checkboxes — use the Tree View component. |
| `ungroup-16` | Two shapes separating apart. | Ungroup objects in a design tool. | ungroup, separate, break group. | Group — use group-16. Unlink resources — use unlink-16. Detach instance — different icon. |
| `unlink-16` | A broken chain link. | Unlink an item from a resource, break a relationship. | unlink, broken link, detach. | Link — use link-16. Ungroup — use ungroup-16. Logout — use logout-16. |
| `unlocked-16` | An open padlock. | Unlocked / accessible state, unlock action. | unlocked, open lock, unlock. | Locked outline — use lock-16. Locked filled — use lock-f-16. Logout — use logout-16. |
| `upload-16` | An arrow rising into a tray. | Upload a file or content from local device. | upload, send up, attach upload. | Cloud sync — use cloud-upload-download-16. Send message — use send-16. Eject media — use media-eject-16. |
| `verified-16` | A shield with a checkmark inside. | Verified entity / account, trusted-source indicator. | verified, badge, trusted, shield, check. | Successful action — use c-check-16. Qualified — use qualified-16. User confirmed — use user-added-16. Protection state — use protection-16. |
| `view-replacement-16` | Reload arrows in a loop with an additional arrow pointing outward. | Search-view replacement / alternative view in a Search context, refresh with redirect. | view replacement, search view, replace view, reload external. | Swap two items — use swap-horizontal-16. Refresh view — use refresh-16. |
| `warning-16` | An exclamation mark inside an outline triangle. | Standard warning alert (banner / status). | warning, alert, caution, triangle warning. | Filled emphasis — use warning-f-16. Critical level — use warning-critical-16. Circle inline — use c-warning-16. |
| `warning-critical-16` | An exclamation mark inside an octagon (stop-sign shape). | Critical / blocking warning state, severe-alert banners. | warning critical, severe alert, blocker, stop sign. | Standard warning — use warning-16. Filled critical — use warning-critical-f-16. |
| `warning-critical-f-16` | A filled octagon with an exclamation mark inside. | Strongly emphasized critical / blocking alert. | warning critical filled, severe blocker, stop sign filled. | Outline critical — use warning-critical-16. Standard — use warning-16 or warning-f-16. |
| `warning-f-16` | An exclamation mark inside a filled triangle. | Emphasized warning alert. | warning filled, emphasized warning. | Outline — use warning-16. Critical — use warning-critical-16. Inline — use c-warning-16. |
| `webpage-16` | A frame with a sidebar on the left and a main content area on the right. | Webpage references, web-content links, browser-page indicators, page-with-sidebar layouts. | webpage, browser, web page, site, sidebar layout. | Hyperlink to a URL — use hyperlink-16. Browser window — use windows-16. Article — use article-16. |
| `windows-16` | A single browser window frame with a URL bar. | Window management, single-window contexts, browser reference. | window, browser window, URL bar. | Webpage layout — use webpage-16. Tabs — use a tab icon. |
| `zoom-in-16` | A magnifier with a plus. | Zoom in on content, increase magnification. | zoom in, magnify, enlarge view. | Search — use search-16. Enlarge object — use enlarge-16. Maximize window — use maximize-16. |
| `zoom-out-16` | A magnifier with a minus. | Zoom out from content, decrease magnification. | zoom out, reduce, shrink view. | Search — use search-16. Minimize window — different icon. |

## Deprecated

The Figma file contains a `Deprecated` page with **449 archived icons** that must not be used in new work. The deprecations follow two patterns:

**Size deprecation — the entire `-12` and `-24` size sets are deprecated.**

Only the `-16` size ships as current. Every icon in this catalog is `-16`; if someone hands you a name ending in `-12` or `-24`, treat it as deprecated and swap in the same base name with `-16`. Concretely: 66 `-12` icons and 359 `-24` icons are on the Deprecated page.

**Individual `-16` deprecations.** 23 `-16` icons are also deprecated and must not be recommended:

- `arrow-up-16` — a superseded design (the current `arrow-up-16` in the Arrows category is the replacement; if you encounter the deprecated instance, ignore it)
- `clock-16` — a superseded design (current `clock-16` in Date & Time is the replacement)
- `security-16` — replaced by `shield-16` / `protection-16` / `shield-settings-16` depending on intent
- `cloud-16-deprecated` — replaced by `cloud-16`
- `no-indicator-1-16` … `no-indicator-9-16`, `no-indicator-more-16`, `no-indicator-i-1-16` … `no-indicator-i-9-16`, `no-indicator-i-more-16` — 21 old counter-badge glyphs, replaced by the current **Indicator** component (`ifx-indicator` with `number` or `dot` variant) — do not reintroduce these as icons

**Spelling rename.** `arrow-triangle-vertikal-*` (German spelling) → `arrow-triangle-vertical-16` (English). The deprecated `-12` and `-24` instances still carry the German spelling; the current `-16` uses the English spelling.

**How to check:** the Deprecated page in Figma (`13284:1289` neighboring page `20758:1521`) is authoritative. When in doubt whether an icon is deprecated, open that page.

## Source

**Single source of truth: the Figma file** `yWwaLoqsWLWygDxXfvdym9` (Infineon DDS UI Icon Library). This catalog mirrors the Component Description set on each Figma Component.

**Direction of sync:** Figma → this catalog. Never the reverse. When a Component Description is edited in Figma, this catalog is regenerated to match. The Docx export (`icon-library-descriptions.docx`) is a secondary artifact and may lag behind — do not treat it as authoritative. If Docx, Skill, and Figma disagree, Figma wins.

**Node IDs for the current version:** file `yWwaLoqsWLWygDxXfvdym9`, "Icon Library" page `13284:1289`, "Deprecated" page `20758:1521`.