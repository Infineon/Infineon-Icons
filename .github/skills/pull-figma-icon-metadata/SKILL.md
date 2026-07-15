---
name: pull-figma-icon-metadata
description: 'Pull icon metadata from a Figma node URL and upsert it into icons.meta.json. Use when adding or updating icon category/metaphor/useFor/keywords/avoidFor entries from Infineon DDS Figma library.'
argument-hint: 'Figma node URL, e.g. https://www.figma.com/design/<fileKey>/<fileName>?node-id=12345-6789'
user-invocable: true
---

# Pull Figma Icon Metadata

## What This Skill Does
Given a Figma node URL for an icon, this skill:
1. Extracts `fileKey` and `nodeId` from the URL.
2. Automatically explores Figma to find the containing section/category for that icon when possible.
3. Uses Figma MCP to fetch icon metadata and description guidance.
4. Normalizes that data into the repository metadata shape.
5. Upserts the icon entry in `icons.meta.json`.

## When To Use
- Adding a newly created icon from Figma into icon metadata.
- Syncing updated icon usage guidance from Figma.
- Repairing stale `category`, `metaphor`, `useFor`, `keywords`, or `avoidFor` entries.

Trigger phrases:
- "pull figma icon metadata"
- "sync icon metadata from figma"
- "update icons.meta from node link"
- "figma node to icons.meta"

## Inputs
- Required: A Figma design node URL with `node-id`, for example:
  - `https://www.figma.com/design/yWwaLoqsWLWygDxXfvdym9/Infineon-DDS-%7C-UI-icon-library?node-id=13284-2536`
- Optional: A section URL to verify membership (for example `...?node-id=16127-375`).

## Scope
- This skill is single-icon by default: one icon node URL per invocation.
- If multiple icon URLs are provided, process them one-by-one as repeated single-icon runs (no parallel section traversal), and report one result per icon.
- Do not perform broad bulk rewrites of unrelated icons in `icons.meta.json`.

## Procedure
1. Parse URL fields.
- Extract `fileKey` from `/design/<fileKey>/...`.
- Extract `nodeId` from `node-id=<a>-<b>` and convert to `a:b` for MCP.
- Preserve the original URL string to store in the metadata `figma` field.

2. Fetch Figma metadata.
- Call `mcp_figma_mcp_ser_get_metadata` with `fileKey` and parsed `nodeId`.
- Read icon symbol name (for example `address-book-16`) from metadata.

3. Auto-discover containing section (category) from icon link using cached traversal only.
- Maintain a local sections list file at `.github/skills/pull-figma-icon-metadata/sections.json` with entries shaped like `{ "sectionId": "16127:375", "name": "Communication" }`.
- Never fan out section calls in parallel. Call `mcp_figma_mcp_ser_get_metadata` one section at a time and stop at the first match.
- Build a token-efficient probe order before calling MCP:
  - If user provided a section URL, verify that section first.
  - If updating an existing icon key in `icons.meta.json`, try the icon's current category section next.
  - Prefer high-signal name hints from `symbolName` (for example, `file-*` -> `Files`, `mail|chat|comment|contact|inbox` -> `Communication`) when that section exists in cache.
  - Then traverse remaining cached sections in deterministic order, prioritizing historically dense sections first (for example `Files`, `Communication`, then the rest).
- For each candidate section:
  - Call `mcp_figma_mcp_ser_get_metadata` with that `sectionId`.
  - Check whether returned XML includes `<symbol id="<iconNodeId>" .../>`.
  - On first match, use that section name as category and stop traversal.
- Fallback behavior:
  - If no containing section can be proven, continue metadata upsert and report section as `unknown`.

3a. Update local sections list when section is known.
- When section is discovered or user-provided and verified, ensure `.github/skills/pull-figma-icon-metadata/sections.json` contains `{ sectionId, name }`.
- Insert missing sections and keep names in their original display form (for example `Communication`).

4. Fetch Figma description guidance.
- Call `mcp_figma_mcp_ser_get_design_context` with the same `fileKey` and `nodeId`.
- For metadata-only sync (this skill's default path), set `excludeScreenshot: true` to avoid downloading screenshot/image payload.
- Only request screenshot context when explicitly needed for visual verification.
- If `get_design_context` is unavailable in the current environment, fallback to icon/component `description` text from metadata traversal and mark the run as `metadataSource: description-fallback` in the summary.
- Extract these fields from component description text:
  - `metaphor`
  - `useFor` (array)
  - `keywords` (array)
  - `avoidFor` (array of objects with `case` and one or more recommendation fields)
  - Supported recommendation fields per `avoidFor` item:
    - `useInsteadIcons`: array of canonical icon names (use one item for single-icon recommendations, multiple for alternatives).
    - `useInsteadText`: plain-text guidance when recommendation is contextual and not a strict icon id.
  - Normalize any icon names in `useInsteadIcons[]` to canonical names without size suffix (for example `comment-16` -> `comment`).
  - Cross-check normalized names against `glyphmap.json` keys when available.

5. Build normalized entry.
- `symbolName`: metadata symbol name (example: `address-book-16`).
- `name`: remove trailing size suffix from `symbolName` (example: `address-book`).
- `iconKey`: use `name` (base name only, no size suffix).
- `file`: `<symbolName>.svg`.
- `category`: lowercase section name from discovery (example: `Communication` -> `communication`). If no section is discoverable, use `unknown`.
- `figma`: original input URL.
- Description fields from step 4.
- `avoidFor` supports:
  - `useInsteadIcons` for one or multiple icon options.
  - `useInsteadText` for textual guidance.
- All icon ids in `avoidFor` (`useInsteadIcons[]`) must use base names only (no `-16` suffix), matching `glyphmap.json` naming.

Target object shape:

```json
{
  "address-book": {
    "name": "address-book",
    "file": "address-book-16.svg",
    "category": "communication",
    "metaphor": "An address-book booklet with tabs.",
    "useFor": ["Address book", "Contact directory", "Full-contacts view"],
    "keywords": ["address book", "contacts", "directory", "rolodex"],
    "avoidFor": [
      { "case": "Single contact", "useInsteadIcons": ["contact"] },
      { "case": "Generic CAD or 3D", "useInsteadIcons": ["file-vdf", "file-vdn", "file-vnd"], "useInsteadText": "Use the format-specific icon depending on the CAD tool." },
      { "case": "Context-dependent choice", "useInsteadText": "Choose the icon that matches the user's file format or system." }
    ],
    "figma": "https://www.figma.com/design/...?..."
  }
}
```

6. Locate metadata file and upsert.
- Use `icons.meta.json`.

Upsert rules:
- Existing file format is expected as an object: `{ ...iconEntries }`.
- Use `iconKey = name` (base name, no size suffix).
- If `iconKey` exists in the object, replace only that icon object.
- If `iconKey` does not exist, add it to the object.
- `category` is required on every icon object. If section discovery fails, write `"category": "unknown"`.
- `avoidFor` items may contain `useInsteadIcons`, `useInsteadText`, or both.
- Any icon ids in `avoidFor` (`useInsteadIcons[]`) must use canonical glyph names without size suffix (for example `mail`, not `mail-16`).
- Keep the root shape intact.
- Preserve valid JSON formatting (4-space indentation).

7. Validate and report.
- Confirm written JSON parses.
- Confirm the target icon key exists with all required fields, including `category`.
- Confirm every icon id in `avoidFor` (`useInsteadIcons[]`) for the target icon is suffix-free and aligns to `glyphmap.json` keys when present.
- If section was resolved through local sections list traversal, report the matching `sectionId`.
- Summarize: updated file path, icon key, whether action was create or update, and section discovery result.

## Decision Points
- If `node-id` is missing: stop and request a node-specific Figma URL.
- If multiple icon URLs are supplied: keep single-icon semantics and process sequentially as N single-icon upserts; never fan out section checks in parallel.
- If Figma MCP returns metadata but no description fields: keep existing description fields when updating; on create, add placeholders and mark as incomplete.
- If metadata file is missing: create `icons.meta.json` with `{}` then insert the icon key.
- If section discovery fails during cached traversal: do not block; complete icon metadata upsert and explicitly report `section: unknown`.
- If section verification was provided and fails, continue sequential cached traversal with next best candidate.
- If any `avoidFor[].useInsteadIcons[]` value contains a sized variant (for example `*-16`): strip the trailing size suffix before write.

## Completion Checklist
- URL parsed successfully into `fileKey` and MCP `nodeId`.
- Section discovery attempted using cached traversal only.
- Cached traversal executed sequentially (no parallel section MCP calls) with likelihood-based ordering.
- `get_metadata` and `get_design_context` were both called.
- `get_design_context` was called with `excludeScreenshot: true` unless visual verification was explicitly requested.
- Icon entry normalized to repo schema.
- `category` is present in the upserted icon entry (`unknown` allowed).
- `avoidFor` recommendations are preserved as icons (`useInsteadIcons`) and optional text guidance (`useInsteadText`) as provided by source context.
- Icon ids in `avoidFor` (`useInsteadIcons[]`) use canonical icon names without size suffix.
- Metadata file upserted with valid JSON.
- Final summary includes file path, icon key, and section discovery status.
