"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import GeneratorPanel from "@/components/generator/GeneratorPanel";
import Workspace from "@/components/workspace/Workspace";
import Lightbox from "@/components/workspace/Lightbox";
import Toast from "@/components/ui/Toast";
import { useGenerations } from "@/hooks/useGenerations";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./Studio.module.css";

const DEFAULT_SETTINGS = {
  mediaType: "image",
  model: "auto",
  prompt: "",
  aiPrompt: true,
  count: 4,
  ratio: "1:1",
  references: [],
};

export default function Studio() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [highlight, setHighlight] = useState(null); // panel section highlighted by the tutorial
  const [sheetOpen, setSheetOpen] = useState(false); // mobile generator sheet
  const [viewer, setViewer] = useState(null); // id of creation open in the lightbox
  const [toast, setToast] = useState(null);
  const promptRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const dismissToast = useCallback(() => setToast(null), []);
  const { creations, status, pending, generate, toggleFavorite, remove } = useGenerations();

  const updateSettings = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);

  const showToast = useCallback((message, tone = "info") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const focusPrompt = useCallback(() => {
    setSheetOpen(true);
    // Wait for the sheet/panel to be visible before focusing.
    requestAnimationFrame(() => promptRef.current?.focus());
  }, []);

  const handleGenerate = useCallback(async () => {
    const prompt = settings.prompt.trim();
    if (prompt.length < 3) {
      showToast("Describe your idea in a few words first.", "warning");
      focusPrompt();
      return;
    }
    setSheetOpen(false);
    const result = await generate({
      prompt,
      type: settings.mediaType,
      model: settings.model,
      ratio: settings.ratio,
      count: settings.count,
    });
    if (result.ok) {
      const n = result.items.length;
      showToast(`${n} new ${settings.mediaType === "video" ? "video" : n === 1 ? "image" : "images"} ready`, "success");
    } else if (result.error) {
      showToast(result.error, "danger");
    }
  }, [settings, generate, showToast, focusPrompt]);

  const applyPrompt = useCallback(
    (item) => {
      updateSettings({
        prompt: item.prompt,
        ...(item.ratio ? { ratio: item.ratio } : {}),
        ...(item.type ? { mediaType: item.type } : {}),
      });
      setViewer(null);
      focusPrompt();
      showToast("Prompt loaded — tweak it and generate", "info");
    },
    [updateSettings, focusPrompt, showToast]
  );

  // Global shortcut: "/" focuses the prompt (like search in many pro tools).
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && !viewer) {
        e.preventDefault();
        focusPrompt();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusPrompt, viewer]);

  const viewerIndex = creations.findIndex((c) => c.id === viewer);

  return (
    <div className={styles.app}>
      <a href="#workspace" className="skip-link">
        Skip to workspace
      </a>

      <Sidebar active="image" />

      <div className={`${styles.panelWrap} ${sheetOpen ? styles.sheetOpen : ""}`} inert={isMobile && !sheetOpen}>
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close generator"
          tabIndex={sheetOpen ? 0 : -1}
          onClick={() => setSheetOpen(false)}
        />
        <GeneratorPanel
          settings={settings}
          onChange={updateSettings}
          onGenerate={handleGenerate}
          isGenerating={Boolean(pending)}
          highlight={highlight}
          promptRef={promptRef}
          onClose={() => setSheetOpen(false)}
          onNotify={showToast}
        />
      </div>

      <Workspace
        creations={creations}
        status={status}
        pending={pending}
        onOpen={setViewer}
        onFavorite={toggleFavorite}
        onRemix={applyPrompt}
        onUseTemplate={applyPrompt}
        onTutorialStep={setHighlight}
        onStartCreating={focusPrompt}
      />

      <MobileNav
        prompt={settings.prompt}
        isGenerating={Boolean(pending)}
        onOpenGenerator={focusPrompt}
      />

      {viewerIndex >= 0 && (
        <Lightbox
          items={creations}
          index={viewerIndex}
          onNavigate={(i) => setViewer(creations[i].id)}
          onClose={() => setViewer(null)}
          onRemix={applyPrompt}
          onFavorite={toggleFavorite}
          onDelete={(id) => {
            remove(id);
            setViewer(null);
            showToast("Creation deleted", "info");
          }}
        />
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
