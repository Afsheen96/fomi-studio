"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { TUTORIAL_STEPS } from "@/lib/mockData";
import styles from "./TutorialCarousel.module.css";

// Onboarding hero. Each step also highlights the matching control in the generator panel,
// so the guide teaches by pointing at the real UI instead of a static screenshot.
export default function TutorialCarousel({ onStep, onDismiss, onFullTutorial }) {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const step = TUTORIAL_STEPS[index];
  const total = TUTORIAL_STEPS.length;

  const go = (next) => {
    const i = (next + total) % total;
    setIndex(i);
    onStep(TUTORIAL_STEPS[i].focus);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onStep(null), 3500);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Getting started with the Image Generator"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Hide getting started guide">
        <Icon name="x" size={16} />
      </button>

      <div className={styles.intro}>
        <span className={styles.badge}>
          <Icon name="image" size={16} />
        </span>
        <h2 className={styles.title}>Image Generator</h2>
        <p className={styles.subtitle}>Create AI images from a text prompt or an image reference</p>
      </div>

      <div className={styles.stage}>
        <div
          key={step.id}
          className={styles.slide}
          role="group"
          aria-roledescription="slide"
          aria-label={`Step ${index + 1} of ${total}: ${step.title}`}
        >
          <div className={styles.visual} aria-hidden="true">
            <StepVisual focus={step.focus} />
          </div>
          <div className={styles.caption}>
            <span className={styles.stepNum}>Step {index + 1}</span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepBody}>{step.body}</p>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <span className={styles.spacer} />
        <div className={styles.pager}>
          <button type="button" className={styles.navBtn} onClick={() => go(index - 1)} aria-label="Previous step">
            <Icon name="chevronLeft" size={16} />
          </button>
          <span className={styles.counter} aria-live="polite">
            {index + 1} / {total}
          </span>
          <button type="button" className={styles.navBtn} onClick={() => go(index + 1)} aria-label="Next step">
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
        <button type="button" className={styles.fullBtn} onClick={onFullTutorial}>
          <Icon name="play" size={12} filled /> Full tutorial
        </button>
      </div>
    </section>
  );
}

function StepVisual({ focus }) {
  if (focus === "model") {
    return (
      <div className={styles.mockList}>
        {["Auto", "Fomi Vision 2", "Fomi Art"].map((m, i) => (
          <div key={m} className={`${styles.mockRow} ${i === 1 ? styles.mockRowActive : ""}`}>
            <span className={styles.mockDot} />
            {m}
            {i === 1 && <Icon name="check" size={13} />}
          </div>
        ))}
      </div>
    );
  }
  if (focus === "prompt") {
    return (
      <div className={styles.mockPrompt}>
        <span>
          A lighthouse on a cliff during an aurora<span className={styles.caret} />
        </span>
        <div className={styles.mockPromptBar}>
          <span className={styles.mockToggle} /> AI prompt
        </div>
      </div>
    );
  }
  if (focus === "references") {
    return (
      <div className={styles.mockRefs}>
        <div className={styles.mockRefImg}>
          <Image src="/mock/aurora.webp" alt="" fill sizes="80px" />
        </div>
        <div className={styles.mockRefImg}>
          <Image src="/mock/moon.webp" alt="" fill sizes="80px" />
        </div>
        <div className={styles.mockRefAdd}>
          <Icon name="plus" size={16} />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.mockGrid}>
      {["/mock/lagoon.webp", "/mock/planet.webp", "/mock/dune.webp", "/mock/prism.webp"].map((src) => (
        <div key={src} className={styles.mockGridCell}>
          <Image src={src} alt="" fill sizes="80px" />
        </div>
      ))}
    </div>
  );
}
