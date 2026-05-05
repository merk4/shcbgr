"use client";

import { useLocale } from "./LocaleProvider";
import styles from "./site.module.css";

export function SiteFooter() {
  const { messages } = useLocale();

  return <footer className={styles.footer}>{messages.footer}</footer>;
}
