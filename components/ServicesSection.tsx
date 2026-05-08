"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "./LocaleProvider";
import styles from "./site.module.css";

gsap.registerPlugin(ScrollTrigger);

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { messages } = useLocale();

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const heading = section.querySelector<HTMLElement>("[data-section-heading]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");

      if (!heading || cards.length === 0) {
        return;
      }

      gsap.set(heading, {
        opacity: 0,
        y: 26
      });

      gsap.set(cards, {
        opacity: 0,
        y: 34,
        scale: 0.985
      });

      gsap
        .timeline({
          defaults: {
            ease: "power3.out"
          },
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true
          }
        })
        .to(heading, {
          opacity: 1,
          y: 0,
          duration: 0.75
        })
        .to(
          cards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.78,
            stagger: 0.1
          },
          "-=0.35"
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className={styles.section}>
      <div className={styles.container}>
        <div data-section-heading className={styles.sectionHeading}>
          <div className={styles.sectionKicker}>{messages.services.kicker}</div>
          <h2>{messages.services.title}</h2>
          <p>{messages.services.copy}</p>
        </div>

        <div className={styles.servicesGrid}>
          {messages.services.items.map((service) => (
            <article key={service.title} data-service-card className={styles.serviceCard}>
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
