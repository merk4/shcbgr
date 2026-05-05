"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLocale } from "./LocaleProvider";
import styles from "./site.module.css";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { messages } = useLocale();

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const items = section.querySelectorAll("[data-contact-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out"
          });

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    gsap.set(items, {
      opacity: 0,
      y: 30,
      scale: 0.985
    });

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className={styles.section}>
      <div className={styles.container}>
        <div data-contact-reveal className={styles.sectionHeading}>
          <div className={styles.sectionKicker}>{messages.contact.kicker}</div>
          <h2>{messages.contact.title}</h2>
          <p>{messages.contact.copy}</p>
        </div>

        <div className={styles.contactGrid}>
          <aside data-contact-reveal className={styles.contactPanel}>
            <p className={styles.contactLead}>
              {messages.contact.lead}
            </p>

            <div className={styles.contactMeta}>
              <div>
                <strong>{messages.contact.visitUs}</strong>
                <span>Theofrastou 68, Keratsini 187 56</span>
              </div>
              <div>
                <strong>{messages.contact.instagram}</strong>
                <span>@superheroescrossbox</span>
              </div>
              <div>
                <strong>{messages.contact.atmosphere}</strong>
                <span>{messages.contact.atmosphereCopy}</span>
              </div>
            </div>

            <div className={styles.socialLinks} aria-label="Social links">
              <a
                href="https://www.instagram.com/superheroescrossbox/"
                target="_blank"
                rel="noreferrer"
              >
                {messages.contact.instagram}
              </a>
              <a
                href="https://maps.google.com/?q=%CE%98%CE%B5%CF%8C%CF%86%CF%81%CE%B1%CF%83%CF%84%CE%BF%CF%85+68,+%CE%9A%CE%B5%CF%81%CE%B1%CF%84%CF%83%CE%AF%CE%BD%CE%B9+187+56"
                target="_blank"
                rel="noreferrer"
              >
                {messages.contact.directions}
              </a>
            </div>
          </aside>

          <div data-contact-reveal className={styles.contactForm}>
            <div className={styles.contactSupportBlock}>
              <div className={styles.bookingKicker}>{messages.contact.supportKicker}</div>
              <h3>{messages.contact.supportTitle}</h3>
              <p>{messages.contact.supportCopy}</p>
              <div className={styles.contactSupportActions}>
                <a
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  href="https://www.instagram.com/superheroescrossbox/"
                  target="_blank"
                  rel="noreferrer"
                >
                  {messages.contact.supportInstagram}
                </a>
                <a className={`${styles.button} ${styles.buttonSecondary}`} href="#booking">
                  {messages.contact.supportBooking}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
