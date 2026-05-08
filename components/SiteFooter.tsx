"use client";

import { useLocale } from "./LocaleProvider";
import styles from "./site.module.css";

export function SiteFooter() {
  const { messages } = useLocale();

  return (
    <footer className={styles.footer}>
      <p>{messages.footer.tagline}</p>
      <p className={styles.footerCredit}>
        <span>{messages.footer.credit}</span>
        <a
          href="https://www.instagram.com/nmerk_/"
          target="_blank"
          rel="noreferrer"
          className={styles.footerLink}
        >
          @nmerk
        </a>
      </p>
    </footer>
  );
}
