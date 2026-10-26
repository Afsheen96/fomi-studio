// Small client for the mocked API. Keeping fetch logic here keeps components focused on UI.

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export const api = {
  listCreations: () => request("/api/generations").then((d) => d.items),
  listTemplates: () => request("/api/templates").then((d) => d.items),
  generate: (payload) =>
    request("/api/generations", { method: "POST", body: JSON.stringify(payload) }).then((d) => d.items),
};
