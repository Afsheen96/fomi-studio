// Static data that powers the mocked API routes.
// Media files live in /public/mock so the demo works offline and next/image can optimise them.

export const MODELS = [
  { id: "auto", name: "Auto", description: "Picks the best model for your prompt", badge: "Smart" },
  { id: "fomi-v2", name: "Fomi Vision 2", description: "Photoreal detail and natural light", badge: "New" },
  { id: "fomi-art", name: "Fomi Art", description: "Painterly, illustrative styles" },
  { id: "fomi-flash", name: "Fomi Flash", description: "Fast drafts in under 3 seconds", badge: "Fast" },
];

export const ASPECT_RATIOS = [
  { id: "1:1", label: "Square", w: 1, h: 1 },
  { id: "3:4", label: "Portrait", w: 3, h: 4 },
  { id: "4:3", label: "Landscape", w: 4, h: 3 },
  { id: "16:9", label: "Widescreen", w: 16, h: 9 },
];

// Every mock "generation" is drawn from this library.
export const IMAGE_LIBRARY = [
  { src: "/mock/aurora.webp", width: 768, height: 1024, tags: ["dream", "glow", "soft", "aurora", "pastel"] },
  { src: "/mock/dune.webp", width: 1024, height: 768, tags: ["desert", "sunset", "mountain", "landscape", "warm"] },
  { src: "/mock/lagoon.webp", width: 1024, height: 1024, tags: ["neon", "wave", "ocean", "abstract", "lines"] },
  { src: "/mock/planet.webp", width: 1024, height: 1024, tags: ["space", "planet", "cosmic", "orbit", "sci-fi"] },
  { src: "/mock/bloom.webp", width: 1024, height: 1024, tags: ["flower", "bloom", "pink", "soft", "dream"] },
  { src: "/mock/fjord.webp", width: 768, height: 1024, tags: ["mountain", "night", "cold", "landscape", "blue"] },
  { src: "/mock/silk.webp", width: 768, height: 1024, tags: ["fire", "silk", "gold", "abstract", "warm"] },
  { src: "/mock/nebula.webp", width: 1024, height: 768, tags: ["space", "nebula", "galaxy", "cosmic", "purple"] },
  { src: "/mock/moon.webp", width: 768, height: 1024, tags: ["moon", "night", "silver", "space", "calm"] },
  { src: "/mock/mesa.webp", width: 1024, height: 1024, tags: ["desert", "canyon", "sunset", "landscape", "orange"] },
  { src: "/mock/tide.webp", width: 1024, height: 768, tags: ["neon", "green", "wave", "lines", "abstract"] },
  { src: "/mock/prism.webp", width: 768, height: 1024, tags: ["prism", "light", "color", "abstract", "vivid"] },
];

export const VIDEO_LIBRARY = [
  { src: "/mock/clip-drift.mp4", poster: "/mock/clip-drift.webp", width: 640, height: 360, duration: 4 },
  { src: "/mock/clip-ember.mp4", poster: "/mock/clip-ember.webp", width: 640, height: 360, duration: 4 },
  { src: "/mock/clip-tide.mp4", poster: "/mock/clip-tide.webp", width: 640, height: 360, duration: 4 },
];

export const SEED_CREATIONS = [
  {
    id: "seed-1",
    type: "image",
    prompt: "Desert dunes at golden hour, cinematic haze, distant sun",
    model: "fomi-v2",
    ratio: "4:3",
    ...IMAGE_LIBRARY[1],
    createdAt: "2026-10-25T18:20:00.000Z",
  },
  {
    id: "seed-2",
    type: "video",
    prompt: "Slow drift through a violet nebula, ambient loop",
    model: "fomi-flash",
    ratio: "16:9",
    ...VIDEO_LIBRARY[0],
    createdAt: "2026-10-25T17:02:00.000Z",
  },
  {
    id: "seed-3",
    type: "image",
    prompt: "Lonely planet with a golden ring, deep space, minimal",
    model: "fomi-art",
    ratio: "1:1",
    ...IMAGE_LIBRARY[3],
    createdAt: "2026-10-24T21:40:00.000Z",
  },
  {
    id: "seed-4",
    type: "image",
    prompt: "Neon waves of light over a dark ocean, long exposure",
    model: "auto",
    ratio: "1:1",
    ...IMAGE_LIBRARY[2],
    createdAt: "2026-10-24T10:15:00.000Z",
  },
];

export const TEMPLATES = [
  { id: "t-product", title: "Product on pedestal", category: "Commerce", uses: "12.4k", ...IMAGE_LIBRARY[9], prompt: "Studio product shot on a warm canyon-toned pedestal, soft shadows" },
  { id: "t-poster", title: "Cosmic poster", category: "Poster", uses: "8.1k", ...IMAGE_LIBRARY[7], prompt: "Retro sci-fi poster, swirling nebula, bold negative space" },
  { id: "t-portrait", title: "Dreamy portrait light", category: "Portrait", uses: "21.9k", ...IMAGE_LIBRARY[0], prompt: "Soft aurora rim light, pastel haze, dreamy editorial portrait" },
  { id: "t-wallpaper", title: "Phone wallpaper", category: "Wallpaper", uses: "30.2k", ...IMAGE_LIBRARY[11], prompt: "Vivid prism light leaks, vertical wallpaper, glossy gradients" },
  { id: "t-landscape", title: "Mountain at dusk", category: "Landscape", uses: "6.7k", ...IMAGE_LIBRARY[5], prompt: "Layered mountain silhouettes at dusk, cool blue atmosphere" },
  { id: "t-abstract", title: "Liquid gold", category: "Abstract", uses: "4.3k", ...IMAGE_LIBRARY[6], prompt: "Flowing ribbons of molten gold and red silk, macro detail" },
];

export const TUTORIAL_STEPS = [
  { id: 1, title: "Pick a model", body: "Choose the model that best fits your creative goal and style.", focus: "model" },
  { id: 2, title: "Describe your image", body: "Write what you want to see. Use @ to mention a saved reference.", focus: "prompt" },
  { id: 3, title: "Add references", body: "Guide style or keep a character consistent with reference images.", focus: "references" },
  { id: 4, title: "Generate & refine", body: "Create up to 4 variations, then remix your favourite.", focus: "generate" },
];
