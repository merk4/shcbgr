"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";
import styles from "./site.module.css";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { locale } = useLocale();

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > 420);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  const label =
    locale === "el"
      ? "\u03A0\u03AF\u03C3\u03C9 \u03C3\u03C4\u03B7\u03BD \u03BA\u03BF\u03C1\u03C5\u03C6\u03AE"
      : "Back to top";

  return (
    <button
      type="button"
      className={`${styles.backToTopButton} ${isVisible ? styles.backToTopButtonVisible : ""}`}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      <span className={styles.backToTopArrow} aria-hidden="true" />
    </button>
  );
}
