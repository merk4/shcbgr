"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLocale } from "./LocaleProvider";
import styles from "./site.module.css";

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { messages } = useLocale();

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

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

    const targets = section.querySelectorAll("[data-reveal]");

    gsap.set(targets, {
      opacity: 0,
      y: 30,
      scale: 0.985
    });

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="services" className={styles.section}>
      <div className={styles.container}>
        <div data-reveal className={styles.sectionHeading}>
          <div className={styles.sectionKicker}>{messages.services.kicker}</div>
          <h2>{messages.services.title}</h2>
          <p>{messages.services.copy}</p>
        </div>

        <div className={styles.servicesGrid}>
          {messages.services.items.map((service) => (
            <article key={service.title} data-reveal className={styles.serviceCard}>
              <div className={styles.serviceBadge} aria-hidden="true">
                {service.code}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
