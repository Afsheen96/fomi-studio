// Works out what changed between two versions, so the user can see
// "why does this one look different?" without comparing prompts by eye.

const words = (text) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);

export function diffVersions(parent, child) {
  if (!parent || !child) return [];
  const before = new Set(words(parent.prompt));
  const after = new Set(words(child.prompt));
  const changes = [];

  const added = [...after].filter((w) => !before.has(w));
  const removed = [...before].filter((w) => !after.has(w));
  if (added.length) changes.push({ kind: "added", label: "Added", value: added.join(", ") });
  if (removed.length) changes.push({ kind: "removed", label: "Removed", value: removed.join(", ") });
  if (parent.model !== child.model) changes.push({ kind: "setting", label: "Model", value: `${parent.model} → ${child.model}` });
  if (parent.ratio !== child.ratio) changes.push({ kind: "setting", label: "Ratio", value: `${parent.ratio} → ${child.ratio}` });

  return changes;
}

// v1 → v2 → v4 : the path from the first version to this one
export function lineage(versions, id) {
  const byId = Object.fromEntries(versions.map((v) => [v.id, v]));
  const path = [];
  let current = byId[id];
  while (current) {
    path.unshift(current);
    current = current.parentId ? byId[current.parentId] : null;
  }
  return path;
}
