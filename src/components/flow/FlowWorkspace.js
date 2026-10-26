"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import ProjectRail from "./ProjectRail";
import Stage from "./Stage";
import VersionTimeline from "./VersionTimeline";
import Composer from "./Composer";
import Inspector from "./Inspector";
import { FLOW_PROJECTS } from "@/lib/flowData";
import { api } from "@/lib/api";
import styles from "./FlowWorkspace.module.css";

const latestOf = (project) => project.versions[project.versions.length - 1];

export default function FlowWorkspace() {
  const [projects, setProjects] = useState(FLOW_PROJECTS);
  const [projectId, setProjectId] = useState(FLOW_PROJECTS[0].id);
  const [versionId, setVersionId] = useState(latestOf(FLOW_PROJECTS[0]).id);
  const [compare, setCompare] = useState(false);
  const [pending, setPending] = useState(null);
  const [toast, setToast] = useState(null);

  const project = projects.find((p) => p.id === projectId);
  const versions = project.versions;
  const version = versions.find((v) => v.id === versionId) || latestOf(project) || null;
  const parent = version?.parentId ? versions.find((v) => v.id === version.parentId) : null;
  const versionNumber = (id) => versions.findIndex((v) => v.id === id) + 1;

  const notify = useCallback((message, tone = "info") => setToast({ id: Date.now(), message, tone }), []);
  const closeToast = useCallback(() => setToast(null), []);

  const openProject = (id) => {
    const next = projects.find((p) => p.id === id);
    setProjectId(id);
    setVersionId(next.versions.length ? latestOf(next).id : null);
    setCompare(false);
  };

  const updateVersion = (id, patch) => {
    setProjects((all) =>
      all.map((p) =>
        p.id !== projectId ? p : { ...p, versions: p.versions.map((v) => (v.id === id ? { ...v, ...patch } : v)) }
      )
    );
  };

  const createProject = () => {
    const id = `p-${Date.now()}`;
    setProjects((all) => [
      { id, name: "Untitled project", client: "New", updatedAt: new Date().toISOString(), versions: [] },
      ...all,
    ]);
    setProjectId(id);
    setVersionId(null);
    setCompare(false);
  };

  // A new generation is always a child of the version you were looking at.
  const generate = async ({ prompt, model, ratio }) => {
    if (pending) return;
    const baseId = version?.id || null;
    setPending({ baseId, number: versions.length + 1 });
    try {
      const [item] = await api.generate({
        prompt,
        model,
        ratio,
        count: 1,
        type: "image",
        avoid: version ? [version.src] : [],
      });
      const newVersion = {
        id: item.id,
        parentId: baseId,
        prompt,
        model,
        ratio,
        src: item.src,
        width: item.width,
        height: item.height,
        note: "",
        createdAt: item.createdAt,
      };
      setProjects((all) =>
        all.map((p) =>
          p.id !== projectId ? p : { ...p, updatedAt: item.createdAt, versions: [...p.versions, newVersion] }
        )
      );
      setVersionId(newVersion.id);
      setCompare(Boolean(baseId));
      notify(`v${versions.length + 1} created${baseId ? ` from v${versionNumber(baseId)}` : ""}`, "success");
    } catch (err) {
      notify(err.message, "danger");
    } finally {
      setPending(null);
    }
  };

  // ← → move through versions, C toggles compare (only when not typing)
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const i = versions.findIndex((v) => v.id === versionId);
      if (e.key === "ArrowRight" && i < versions.length - 1) setVersionId(versions[i + 1].id);
      if (e.key === "ArrowLeft" && i > 0) setVersionId(versions[i - 1].id);
      if (e.key.toLowerCase() === "c" && parent) setCompare((c) => !c);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [versions, versionId, parent]);

  const starredCount = useMemo(() => versions.filter((v) => v.starred).length, [versions]);

  return (
    <div className={styles.app}>
      <a href="#stage" className="skip-link">
        Skip to canvas
      </a>

      <header className={styles.topbar}>
        <div className={styles.topLeft}>
          <Link href="/" className={styles.back} title="Back to the original layout">
            <Icon name="arrowLeft" size={16} />
            <span>Classic view</span>
          </Link>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.logo} aria-hidden="true">
            <Icon name="sparkles" size={14} />
          </span>
          <span className={styles.brand}>Fomi Flow</span>
          <span className={styles.beta}>Concept</span>
        </div>

        <label className={styles.mobileProject}>
          <span className="visually-hidden">Project</span>
          <select value={projectId} onChange={(e) => openProject(e.target.value)}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <Icon name="chevronDown" size={14} />
        </label>

        <div className={styles.topRight}>
          <span className={styles.meta}>
            {versions.length} version{versions.length === 1 ? "" : "s"} · {starredCount} starred
          </span>
          <button type="button" className={styles.avatar} aria-label="Account">
            AK
          </button>
        </div>
      </header>

      <ProjectRail projects={projects} activeId={projectId} onOpen={openProject} onCreate={createProject} />

      <main className={styles.center}>
        <Stage
          version={version}
          parent={parent}
          compare={compare && Boolean(parent)}
          onToggleCompare={() => setCompare((c) => !c)}
          versionLabel={version ? `v${versionNumber(version.id)}` : ""}
          parentLabel={parent ? `v${versionNumber(parent.id)}` : ""}
          pending={pending}
        />

        <VersionTimeline
          versions={versions}
          activeId={version?.id}
          pending={pending}
          onSelect={(id) => setVersionId(id)}
        />

        <Composer
          key={version?.id || projectId}
          base={version}
          baseLabel={version ? `v${versionNumber(version.id)}` : null}
          nextLabel={`v${versions.length + 1}`}
          isGenerating={Boolean(pending)}
          onGenerate={generate}
        />
      </main>

      <Inspector
        version={version}
        parent={parent}
        versions={versions}
        versionNumber={versionNumber}
        onSelect={setVersionId}
        onUpdate={updateVersion}
        onNotify={notify}
      />

      <Toast toast={toast} onDismiss={closeToast} />
    </div>
  );
}
