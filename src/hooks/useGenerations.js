"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

// Owns the list of creations and the "currently generating" placeholders.
export function useGenerations() {
  const [creations, setCreations] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [pending, setPending] = useState(null); // { id, count, ratio, type, prompt }
  const pendingRef = useRef(null);

  useEffect(() => {
    let active = true;
    api
      .listCreations()
      .then((items) => {
        if (!active) return;
        setCreations(items);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  const generate = useCallback(async (payload) => {
    if (pendingRef.current) return { ok: false };
    const batch = {
      id: `pending-${Date.now()}`,
      count: payload.type === "video" ? 1 : payload.count,
      ratio: payload.ratio,
      type: payload.type,
      prompt: payload.prompt,
    };
    pendingRef.current = batch;
    setPending(batch);
    try {
      const items = await api.generate(payload);
      setCreations((prev) => [...items.map((it) => ({ ...it, isNew: true })), ...prev]);
      return { ok: true, items };
    } catch (error) {
      return { ok: false, error: error.message };
    } finally {
      pendingRef.current = null;
      setPending(null);
    }
  }, []);

  const toggleFavorite = useCallback((id) => {
    setCreations((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)));
  }, []);

  const remove = useCallback((id) => {
    setCreations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { creations, status, pending, generate, toggleFavorite, remove };
}
