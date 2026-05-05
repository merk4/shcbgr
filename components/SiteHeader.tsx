"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "./LocaleProvider";
import styles from "./site.module.css";

export function SiteHeader() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, messages } = useLocale();
  const navItems = [
    { href: "#booking", label: messages.nav.book },
    { href: "#services", label: messages.nav.services },
    { href: "#contact", label: messages.nav.contact }
  ];

  const closeMenu = useCallback(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (dialog.open) {
      dialog.close();
    }

    setIsOpen(false);
  }, []);

  const openMenu = () => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    dialog.showModal();
    setIsOpen(true);
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleCancel = (event: Event) => {
      event.preventDefault();
      closeMenu();
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
    };
  }, [closeMenu]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.nav}>
          <a className={styles.brand} href="#top" aria-label="Superheroes Crossbox home">
            <span className={styles.brandMark} aria-hidden="true">
              <Image
                src="/shcb-brandmark.svg"
                alt=""
                width={74}
                height={74}
                className={styles.brandMarkImage}
                priority
              />
            </span>
            <span>Superheroes Crossbox</span>
          </a>

          <nav className={styles.navLinks} aria-label="Primary">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.localeSwitch} role="group" aria-label="Language switcher">
            <button
              type="button"
              className={`${styles.localeOption} ${locale === "en" ? styles.localeOptionActive : ""}`}
              aria-pressed={locale === "en"}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`${styles.localeOption} ${locale === "el" ? styles.localeOptionActive : ""}`}
              aria-pressed={locale === "el"}
              onClick={() => setLocale("el")}
            >
              GR
            </button>
            <span
              className={styles.localeThumb}
              aria-hidden="true"
              style={{ transform: locale === "el" ? "translateX(100%)" : "translateX(0)" }}
            />
          </div>

          <button
            type="button"
            className={styles.mobileNavTrigger}
            aria-label={messages.nav.openMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-dialog"
            onClick={openMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <dialog ref={dialogRef} id="mobile-nav-dialog" className={styles.mobileNavDialog}>
        <div className={styles.mobileNavSheet}>
          <div className={styles.mobileNavHeader}>
            <div className={styles.mobileNavBrand}>
              <span className={styles.mobileNavBrandMark} aria-hidden="true">
                <Image
                  src="/shcb-brandmark.svg"
                  alt=""
                  width={58}
                  height={58}
                  className={styles.brandMarkImage}
                />
              </span>
              <div>
                <strong>Superheroes Crossbox</strong>
                <span>{messages.nav.location}</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.mobileNavClose}
              aria-label={messages.nav.closeMenu}
              onClick={closeMenu}
            >
              <span />
              <span />
            </button>
          </div>

          <nav className={styles.mobileNavLinks} aria-label="Mobile">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className={styles.mobileLocaleSwitch}>
            <button
              type="button"
              className={`${styles.localeOption} ${locale === "en" ? styles.localeOptionActive : ""}`}
              aria-pressed={locale === "en"}
              onClick={() => setLocale("en")}
            >
              English
            </button>
            <button
              type="button"
              className={`${styles.localeOption} ${locale === "el" ? styles.localeOptionActive : ""}`}
              aria-pressed={locale === "el"}
              onClick={() => setLocale("el")}
            >
              GR
            </button>
          </div>

          <div className={styles.mobileNavFooter}>
            <a
              className={`${styles.button} ${styles.buttonPrimary} ${styles.mobileNavCta}`}
              href="https://www.instagram.com/superheroescrossbox/"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              {messages.nav.instagram}
            </a>
            <a className={`${styles.button} ${styles.buttonSecondary}`} href="#booking" onClick={closeMenu}>
              {messages.nav.bookVisit}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
