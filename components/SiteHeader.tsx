"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { trackEvent } from "@/lib/analytics";
import { useLocale } from "./LocaleProvider";
import styles from "./site.module.css";

export function SiteHeader() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const isClosingRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, messages } = useLocale();
  const navItems = [
    { href: "#booking", label: messages.nav.book },
    { href: "#services", label: messages.nav.services },
    { href: "#contact", label: messages.nav.contact }
  ];

  const handleLocaleChange = (nextLocale: "en" | "el") => {
    if (locale === nextLocale) {
      return;
    }

    trackEvent("locale_switch", {
      from_locale: locale,
      to_locale: nextLocale
    });
    setLocale(nextLocale);
  };

  const closeMenu = useCallback(() => {
    const dialog = dialogRef.current;
    const sheet = sheetRef.current;

    if (!dialog || !dialog.open || isClosingRef.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !sheet) {
      dialog.close();
      setIsOpen(false);
      return;
    }

    isClosingRef.current = true;
    const mobileItems = dialog.querySelectorAll("[data-mobile-nav-item]");

    gsap.to(mobileItems, {
      opacity: 0,
      y: 12,
      duration: 0.18,
      stagger: 0.02,
      ease: "power2.in",
      overwrite: true
    });

    gsap.to(sheet, {
      xPercent: 8,
      opacity: 0.72,
      duration: 0.28,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        isClosingRef.current = false;

        if (dialog.open) {
          dialog.close();
        }

        setIsOpen(false);
        gsap.set(sheet, { clearProps: "transform,opacity" });
        gsap.set(mobileItems, { clearProps: "transform,opacity" });
      }
    });
  }, []);

  const openMenu = () => {
    const dialog = dialogRef.current;
    const sheet = sheetRef.current;

    if (!dialog || dialog.open || isClosingRef.current) {
      return;
    }

    dialog.showModal();
    setIsOpen(true);
    trackEvent("mobile_menu_open", {
      source: "header"
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !sheet) {
      return;
    }

    const mobileItems = dialog.querySelectorAll("[data-mobile-nav-item]");

    gsap.set(sheet, {
      xPercent: 8,
      opacity: 0.72
    });

    gsap.set(mobileItems, {
      opacity: 0,
      y: 18
    });

    gsap
      .timeline({
        defaults: {
          ease: "power3.out"
        }
      })
      .to(sheet, {
        xPercent: 0,
        opacity: 1,
        duration: 0.42
      })
      .to(
        mobileItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.34,
          stagger: 0.04
        },
        "-=0.2"
      );
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
                src="/logo.png"
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

          <button
            type="button"
            className={styles.localeSwitch}
            aria-label="Language switcher"
            aria-pressed={locale === "el"}
            onClick={() => handleLocaleChange(locale === "en" ? "el" : "en")}
          >
            <span className={`${styles.localeOption} ${locale === "en" ? styles.localeOptionActive : ""}`}>
              EN
            </span>
            <span className={`${styles.localeOption} ${locale === "el" ? styles.localeOptionActive : ""}`}>
              GR
            </span>
            <span
              className={styles.localeThumb}
              aria-hidden="true"
              style={{ transform: locale === "el" ? "translateX(100%)" : "translateX(0)" }}
            />
          </button>

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
        <div ref={sheetRef} className={styles.mobileNavSheet}>
          <div className={styles.mobileNavHeader}>
            <div className={styles.mobileNavBrand}>
              <span className={styles.mobileNavBrandMark} aria-hidden="true">
                <Image
                  src="/logo.png"
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
              <a key={item.href} href={item.href} onClick={closeMenu} data-mobile-nav-item>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className={styles.mobileLocaleSwitch}>
            <button
              type="button"
              className={`${styles.localeOption} ${locale === "en" ? styles.localeOptionActive : ""}`}
              aria-pressed={locale === "en"}
              onClick={() => handleLocaleChange("en")}
              data-mobile-nav-item
            >
              English
            </button>
            <button
              type="button"
              className={`${styles.localeOption} ${locale === "el" ? styles.localeOptionActive : ""}`}
              aria-pressed={locale === "el"}
              onClick={() => handleLocaleChange("el")}
              data-mobile-nav-item
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
              onClick={() => {
                trackEvent("mobile_nav_click", {
                  action: "instagram"
                });
                closeMenu();
              }}
              data-mobile-nav-item
            >
              {messages.nav.instagram}
            </a>
            <a
              className={`${styles.button} ${styles.buttonSecondary}`}
              href="#booking"
              onClick={() => {
                trackEvent("mobile_nav_click", {
                  action: "booking"
                });
                closeMenu();
              }}
              data-mobile-nav-item
            >
              {messages.nav.bookVisit}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
