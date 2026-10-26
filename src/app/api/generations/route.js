import { IMAGE_LIBRARY, VIDEO_LIBRARY, SEED_CREATIONS, MODELS, ASPECT_RATIOS } from "@/lib/mockData";

// Mocked AI backend. GET returns recent creations, POST "generates" new ones.
// The delay mimics real model latency so the UI's loading states are exercised.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function pickMedia(prompt, library, count) {
  const words = prompt.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  const scored = library
    .map((item, index) => ({
      item,
      score: (item.tags || []).filter((tag) => words.some((w) => w.startsWith(tag) || tag.startsWith(w))).length + Math.random() * 0.9,
      index,
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.item);
}

export async function GET() {
  return Response.json({ items: SEED_CREATIONS });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const prompt = String(body?.prompt || "").trim();
  const type = body?.type === "video" ? "video" : "image";
  const count = Math.min(Math.max(Number(body?.count) || 1, 1), 4);
  const model = MODELS.some((m) => m.id === body?.model) ? body.model : "auto";
  const ratio = ASPECT_RATIOS.some((r) => r.id === body?.ratio) ? body.ratio : "1:1";

  if (prompt.length < 3) {
    return Response.json({ error: "Describe your idea in a few words first." }, { status: 400 });
  }

  await wait(type === "video" ? 2600 : 1600 + Math.random() * 900);

  // "avoid" lets the client ask for something different from the image it's editing
  const avoid = Array.isArray(body?.avoid) ? body.avoid : [];
  const fullLibrary = type === "video" ? VIDEO_LIBRARY : IMAGE_LIBRARY;
  const filtered = fullLibrary.filter((m) => !avoid.includes(m.src));
  const library = filtered.length ? filtered : fullLibrary;
  const now = Date.now();
  const items = pickMedia(prompt, library, type === "video" ? 1 : count).map((media, i) => ({
    id: `gen-${now}-${i}`,
    type,
    prompt,
    model,
    ratio,
    ...media,
    createdAt: new Date(now).toISOString(),
  }));

  return Response.json({ items });
}
