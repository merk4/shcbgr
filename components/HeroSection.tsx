"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLocale } from "./LocaleProvider";
import { CalBooking } from "./CalBooking";
import styles from "./site.module.css";

type LayerSpec = {
  element: HTMLDivElement;
  depth: number;
  pointerWeight: number;
};

export function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const midRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { messages } = useLocale();

  useEffect(() => {
    const hero = heroRef.current;
    const background = backgroundRef.current;
    const middle = midRef.current;
    const content = contentRef.current;

    if (!hero || !background || !middle || !content) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([background, middle, content], { clearProps: "transform" });
      return;
    }

    const layers: LayerSpec[] = [
      { element: background, depth: 0.4, pointerWeight: 0.35 },
      { element: middle, depth: 0.6, pointerWeight: 0.75 },
      { element: content, depth: 1, pointerWeight: 0 }
    ];

    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let frameId = 0;

    const getProfile = () => {
      if (window.innerWidth < 768) {
        return { scroll: 0, pointer: 0 };
      }

      if (window.innerWidth < 1080) {
        return { scroll: 24, pointer: 0 };
      }

      return { scroll: 56, pointer: 6 };
    };

    const render = () => {
      const rect = hero.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = gsap.utils.clamp(
        0,
        1,
        (viewportHeight - rect.top) / (rect.height + viewportHeight)
      );
      const offset = progress - 0.5;
      const profile = getProfile();

      pointerX += (targetPointerX - pointerX) * 0.08;
      pointerY += (targetPointerY - pointerY) * 0.08;

      layers.forEach(({ element, depth, pointerWeight }) => {
        const y = offset * profile.scroll * depth * -1 + pointerY * profile.pointer * pointerWeight;
        const x = pointerX * profile.pointer * pointerWeight;

        gsap.set(element, {
          x,
          y,
          force3D: true
        });
      });

      if (
        Math.abs(targetPointerX - pointerX) > 0.005 ||
        Math.abs(targetPointerY - pointerY) > 0.005
      ) {
        frameId = window.requestAnimationFrame(render);
        return;
      }

      frameId = 0;
    };

    const requestRender = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (window.innerWidth < 1080) {
        targetPointerX = 0;
        targetPointerY = 0;
        return;
      }

      const rect = hero.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

      targetPointerX = gsap.utils.clamp(-1, 1, relativeX * 2);
      targetPointerY = gsap.utils.clamp(-1, 1, relativeY * 2);
      requestRender();
    };

    const handlePointerLeave = () => {
      targetPointerX = 0;
      targetPointerY = 0;
      requestRender();
    };

    requestRender();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-reveal]",
        {
          opacity: 0,
          y: 36,
          scale: 0.985
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.08,
          ease: "power3.out"
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.heroStage} aria-hidden="true">
        <div ref={backgroundRef} className={`${styles.parallaxLayer} ${styles.heroBackground}`} />
        <div ref={midRef} className={`${styles.parallaxLayer} ${styles.heroMiddle}`}>
          <div className={styles.heroGrid} />
          <div className={styles.heroOrbGreen} />
          <div className={styles.heroOrbPurple} />
          <div className={styles.heroRing} />
          <div className={styles.heroBeam} />
        </div>
      </div>

      <div className={styles.container}>
        <div ref={contentRef} className={styles.heroContent}>
          <div className={styles.heroLayout}>
            <div className={styles.heroPanel}>
              <div data-hero-reveal className={styles.eyebrow}>
                {messages.hero.eyebrow}
              </div>
              <h1 data-hero-reveal className={styles.heroTitle}>
                {messages.hero.titleLead} <span>{messages.hero.titleAccent}</span>
              </h1>
              <p data-hero-reveal className={styles.heroCopy}>
                {messages.hero.copy}
              </p>
              <div data-hero-reveal className={styles.heroDetails}>
                {messages.hero.details.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div data-hero-reveal className={styles.heroActions}>
                <a className={`${styles.button} ${styles.buttonPrimary}`} href="#booking">
                  {messages.hero.ctaPrimary}
                </a>
                <a className={`${styles.button} ${styles.buttonSecondary}`} href="#services">
                  {messages.hero.ctaSecondary}
                </a>
              </div>
              <div data-hero-reveal className={styles.metrics} aria-label="Gym highlights">
                <div className={styles.metricCard}>
                  <strong>01</strong>
                  <span>{messages.hero.metrics[0]}</span>
                </div>
                <div className={styles.metricCard}>
                  <strong>02</strong>
                  <span>{messages.hero.metrics[1]}</span>
                </div>
                <div className={styles.metricCard}>
                  <strong>03</strong>
                  <span>{messages.hero.metrics[2]}</span>
                </div>
                <div className={styles.metricCard}>
                  <strong>04</strong>
                  <span>{messages.hero.metrics[3]}</span>
                </div>
              </div>
            </div>

            <div data-hero-reveal id="booking" className={styles.heroBookingCard}>
              <div className={styles.heroBookingHeader}>
                <div className={styles.bookingBadge}>{messages.hero.bookingBadge}</div>
                <h2 className={styles.heroBookingTitle}>{messages.hero.bookingTitle}</h2>
                <p className={styles.heroBookingCopy}>
                  {messages.hero.bookingCopy}
                </p>
              </div>
              <CalBooking compact />
              <div className={styles.heroBookingFooter}>
                <span>{messages.hero.bookingFooter[0]}</span>
                <span>{messages.hero.bookingFooter[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
