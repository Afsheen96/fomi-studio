# Fomi Studio: Image Generator workspace

My submission for the FOMI Frontend Developer assessment. It builds the Image Generator mockup as a responsive, production-style Next.js app with a mocked AI backend.

**Built by:** Afsheen Kiran

The repo has two parts:

- **Part A, `/`:** the mockup, rebuilt as a working, responsive page.
- **Part B, `/flow`, "Fomi Flow":** my own redesign of the image workspace. It's for professionals who come back to the same project every day.

## Part B: Fomi Flow (my redesign)

**The problem:** most AI image tools show results as an endless feed. Professionals iterate on one idea many times. Once the feed grows, they can't find the good version from yesterday, can't see what changed between two tries, and lose the client's feedback.

**The idea:** every generation is a **version** inside a **project**, not a feed item.

- **Version history strip.** Each new image becomes v1, v2, v3 and so on. If you go back to v2 and change it, the new image shows "↳ from v2", so you can see where you branched off.
- **Compare slider.** Drag to compare any version with the one it came from (keyboard: `C`, `←` and `→`).
- **"What changed"**: the app works out which prompt words were added or removed, and any model or ratio change, between a version and the one it came from.
- **Path**: shows the chain from v1 to the current version (v1 → v2 → v4). Click any step to jump there.
- **The prompt bar starts filled with the selected version's prompt.** You edit words instead of starting again, and it tells you "Editing from v4, this will create v5".
- **Notes and stars** on each version, to remember client feedback.

On tablet and phone, the projects list becomes a dropdown and the page becomes one column. The prompt bar stays at the bottom where your thumb can reach it.

## Tech stack

- **Next.js 15** (App Router), **JavaScript**, **React 19**
- **CSS Modules** (one stylesheet per component) and global design tokens
- **next/image** for optimised, lazy-loaded media
- **Route Handlers** as a mocked API
- Deployed on **Vercel**

## Features

- **Three-column workspace**: navigation, generator settings, and the canvas, matching the mockup.
- **Generator panel**: model picker (accessible custom listbox), style and character references (upload, preview, remove, max 3), prompt box (AI-prompt toggle, *Enhance*, *Surprise me*, clear), output count, aspect ratio and a live credit cost.
- **Realistic generation flow**: `POST /api/generations` waits like a real model, while the UI shows the right number of skeletons in the chosen aspect ratio. New results fade in with a glow, and a toast confirms.
- **Guided onboarding**: each step of the tutorial carousel highlights the matching control in the real panel, so it teaches using the actual UI.
- **Creations gallery**: masonry layout that keeps true aspect ratios. Filters (All / Images / Videos / Liked), compact view, hover actions (like, reuse prompt, download), and videos that play on hover.
- **Viewer (lightbox)**: keyboard navigation (← →, Esc), focus trap, focus returns to where you were, and prompt and model details with reuse, like, download and delete.
- **Templates and Academy** tabs. A template loads its prompt and settings into the generator.
- **Empty, loading and error states** for every list.

## Responsive behaviour

| Screen | Layout |
| --- | --- |
| Large (≥1800px) | Wider gutters, more masonry columns, content capped at 1680px |
| Desktop | Full sidebar, generator panel and canvas |
| Tablet (≤1180px) | Sidebar collapses to an icon rail so the canvas keeps its space |
| Mobile (≤767px) | Generator becomes a bottom sheet, opened from a thumb-reach prompt bar. Bottom tab bar, two-column gallery |

The page never scrolls sideways at any size.

## Accessibility

Semantic landmarks, a skip link, labelled controls, ARIA tabs, radio groups, switch and listbox patterns, visible focus rings, alt text from prompts, `aria-live` announcements for results and toasts, `inert` on the hidden mobile sheet, and support for `prefers-reduced-motion`.

## Performance

`next/image` with `sizes` and priority for the first two images, lazy-loaded media, `preload="none"` on videos, a memoised `MediaCard`, `next/font` for the font, and a stable callback for the toast.

## Mock API

| Route | Description |
| --- | --- |
| `GET /api/generations` | Recent creations (images and videos) |
| `POST /api/generations` | `{ prompt, type, model, ratio, count }` → returns generated items. Picks media that matches prompt keywords and validates input |
| `GET /api/templates` | Template library |

The mock media in `public/mock` was generated with code (Python and ffmpeg), so the project needs no external image hosts.

## Project structure

```
src/
  app/            layout, page, global styles, API routes, flow/ (Part B page)
  components/
    layout/       Sidebar, MobileNav
    generator/    GeneratorPanel, ModelSelect, References, PromptBox
    workspace/    Workspace, TutorialCarousel, CreationsGrid, MediaCard, TemplateGrid, Academy, Lightbox
    flow/         Part B: FlowWorkspace, ProjectRail, Stage, VersionTimeline, Composer, Inspector
    ui/           Icon, Toast
  hooks/          useGenerations, useMediaQuery
  lib/            mock data, flow data, version diff, API client, formatting
```

## Keyboard shortcuts

`/` focuses the prompt · `Ctrl/⌘ + Enter` generates · `← →` browse in the viewer · `Esc` closes

## Run locally

```bash
npm install
npm run dev
```
