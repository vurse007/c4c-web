<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project conventions

Caring for Caregivers (C4C) marketing site. Next.js App Router + Tailwind v4 + shadcn/ui (`components.json`: style `base-rhea`, baseColor `neutral`, icons `lucide`).

## Design language

- **Palette:** everything is black/white with one accent — Tailwind's default `blue-500` (`#3b82f6`, i.e. `rgb(59, 130, 246)`). Used for links/highlights (e.g. "Connecting **Globally**"), the "Get Involved" section background, hover states, and any decorative glow/gradient accents. Don't introduce other brand colors — `app/globals.css`'s shadcn theme tokens (oklch grayscale) are unused boilerplate; the site styles directly with raw Tailwind classes (`bg-black`, `text-black/50`, `bg-blue-500`, etc.), not the `--primary`/`--accent` CSS variables.
- **No border-radius anywhere.** Images, cards, sections, bento boxes — all sharp rectangular edges. Only fully-round elements (icon buttons, avatars-as-circles) use `rounded-full`.
- **Typography:** custom font-weight vocabulary used throughout — `font-regular` for headings, `font-light` for body copy (never `font-bold`/`font-semibold`). Headings are large and tight: `text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight`. Font is Google's "Stack Sans Headline" (`app/layout.tsx`), loaded with only weights 200 and 400.
- **"White section below a black hero" page pattern** (About, Chapters, Impact, home): a full-height black hero (`h-screen`, fixed background image/video, hairline `bg-white/30` divider at the bottom, headline bottom-left) is followed by a `bg-white` section using this shell:
  ```
  <section className="relative z-10 w-full bg-white">
    <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
      <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight text-black">…</h2>
      <div aria-hidden className="mt-16 h-px w-full bg-black/15 sm:mt-20 lg:mt-24" />
      …
    </div>
  </section>
  ```
  Match this shell (padding scale, heading size, hairline divider) for any new top-level page section.
- **Stat counters** animate with `requestAnimationFrame` + a cubic ease-out (`1 - (1 - progress) ** 3`) over `COUNT_DURATION_MS = 2000`, triggered by an `IntersectionObserver` (threshold ~0.2–0.35) so they count up once when scrolled into view. See `components/ImpactStats.tsx` / `components/ImpactView.tsx` for the reference implementation — reuse this pattern rather than a new one for any new animated number.

## Content/data architecture

- **`lib/team.ts`** is the single source of truth for every person's bio, photo, and org-wide `role` — never duplicate someone's bio text elsewhere. Look them up with `getTeamMember(name)`. `featured: true` marks who appears on the top-level "Our Team" page (reserved for the biggest roles); everyone else in `TEAM` is still valid for chapter boards but won't show there.
- **`lib/chapters.ts`** defines each chapter's board as `{ name, role }[]` (`ChapterBoardMember`) — `name` references a `TEAM` entry, and `role` is a **required** override (a person's org-wide role and their chapter-specific title are often different, e.g. "Co-President" vs. "Chapter President"). Resolve a chapter's board with `getChapterBoard(chapter)`, which merges `TEAM` bio/photo with the chapter-specific role.
- **`components/PeopleList.tsx`** holds the shared `PersonProfile` type and the `PeopleList`/`PeopleSection` rendering components, consumed by `AdvisoryBoard`, `OurTeam`, and the per-chapter board page — don't build a parallel bio-rendering component.

## The Impact page bento grid

- `components/MagicBento.jsx` + `MagicBento.css` implement the "By the Numbers" stat grid (React Bits' MagicBento pattern), restyled to match the site: sharp corners, black cards, `blue-500` glow accent, `font-light`/clamp typography instead of the original's fixed px sizes. Card content (value/prefix/suffix/label/description) lives in the `cardData` array in that file. Grid position (which cards get the big 2×2 spans) is driven by CSS `nth-child` in `MagicBento.css`, so reordering `cardData` changes the layout, not just reading order.
- `components/StatsNetwork.tsx` draws the decorative node-network background effect that spans the Volunteers + Gratitude cards. It's genuinely **one** network: node positions are defined once, on a canvas twice the width of one card, and each card renders the same canvas shifted by a card-width so its `overflow: hidden` shows only its half — the two halves line up exactly at the shared border with no visible seam. `NODES` = `{ id: { x, y, size } }` (x/y are % of the combined canvas; x < 50 is the left/Volunteers card, x > 50 is the right/Gratitude card), `EDGES` = list of `[fromId, toId]` pairs. If you add a node to `NODES`, you must also add a matching `useRef` in the `refs` object in the same file (TypeScript will error otherwise, since `refs` is a hand-written object, not derived from `NODES`).
- `components/StatsGlobe.tsx` uses the same two-card-wide canvas trick for the Reach + Chapters cards (`globe: "left" | "right"` in `cardData`): a cobe globe centered above the cards so only its lower limb hangs into them, rolling forward (theta) with a slow phi sway so every chapter eventually passes. Each card runs its own WebGL instance, kept in sync because the whole rotation is a pure function of the shared `requestAnimationFrame` timestamp (`rotationAt`), not a per-instance counter. The canvas has a CSS `contrast()` filter (with a low `mapBrightness`) to make cobe's soft land dots smaller and crisper; since that filter would crush cobe's own glow, `glowColor` is black and the atmosphere is a CSS ring (`.stats-globe-atmosphere` in `StatsGlobe.css`) sized from the same `RADIUS_OF_WIDTH`/`DEPTH_OF_HEIGHT`. Chapter locations use cobe's "Pulse" showcase recipe (`.stats-globe-pulse`) anchored to cobe marker ids (namespaced per side, since cobe's anchor names / `:root` vars are global). Independent of the home page's `ChapterGlobe` except for reusing its `CHAPTERS` coordinates.
- `components/StatsSpiral.tsx` (adapted from React Bits' InfiniteSpiral) is a photo trail along one continuous path through the Support + Funding cards (`spiral: "support" | "funding"` in `cardData`), which sit diagonally rather than side by side. `PATH` is traced as fractions of each card's own box; at runtime each card measures both cards' `offsetLeft/Top` (not `getBoundingClientRect`, which includes hover transforms) to join them in shared grid coordinates, so the path crosses the gap from Support's left edge into Funding's right edge. Photos are largest at `FOCUS` points and shrink/blur around the loops and both ends; positions are a pure function of the clock, so both cards stay in sync. The curve is centripetal Catmull-Rom (the uniform variant doubled back at the gap, making photos shimmy), and photos are spaced evenly in ∫ds/scale rather than arc length, so they spread out as they grow and never overlap at full size (`SPACING`); the slot count is derived from the geometry. Only rendered at `lg`+, where that diagonal layout exists. Photos come from `public/spiral-gallery/` — `next.config.ts` lists that folder into `NEXT_PUBLIC_SPIRAL_PHOTOS`, so swapping in real photos needs no code change (restart the dev server after adding or renaming files).

## Testing changes

Uses the `webapp-testing` skill's `scripts/with_server.py` + a throwaway Playwright script to visually verify changes (screenshot the dev server) rather than assuming a CSS/layout change looks right from source alone — do this for anything visual before calling it done.

