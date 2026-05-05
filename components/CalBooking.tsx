"use client";

import { useEffect } from "react";
import { useLocale } from "./LocaleProvider";
import styles from "./site.module.css";

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

type CalApi = {
  (action: string, namespaceOrConfig?: unknown, config?: unknown): void;
  loaded?: boolean;
  ns?: Record<string, (...args: unknown[]) => void>;
  q?: unknown[];
};

type CalBookingProps = {
  compact?: boolean;
};

export function CalBooking({ compact = false }: CalBookingProps) {
  const { messages } = useLocale();

  useEffect(() => {
    const initCal = () => {
      const namespace = "unleashyourinnerhero";
      const calLink = "super-heroes-crossbox/unleashyourinnerhero";

      (function (C: Window, A: string, L: string) {
        const p = function (a: { q?: unknown[] }, ar: IArguments | unknown[]) {
          a.q = a.q || [];
          a.q.push(ar);
        };

        const d = C.document;
        const existingCal = C.Cal;
        const cal: CalApi =
          existingCal ||
          function () {
            const ar = arguments;

            if (!cal.loaded) {
              cal.ns = {};
              cal.q = cal.q || [];
              d.head.appendChild(d.createElement("script")).src = A;
              cal.loaded = true;
            }

            if (ar[0] === L) {
              const api = function () {
                p(api as { q?: unknown[] }, arguments);
              };
              const namespace = ar[1];
              (api as { q?: unknown[] }).q = (api as { q?: unknown[] }).q || [];

              if (typeof namespace === "string") {
                cal.ns = cal.ns || {};
                cal.ns[namespace] = cal.ns[namespace] || api;
                p(cal.ns[namespace] as { q?: unknown[] }, ar);
                p(cal as { q?: unknown[] }, ["initNamespace", namespace]);
              } else {
                p(cal as { q?: unknown[] }, ar);
              }

              return;
            }

            p(cal as { q?: unknown[] }, ar);
          };
        C.Cal = cal;
      })(window, "https://app.cal.com/embed/embed.js", "init");

      window.Cal?.("init", namespace, {
        origin: "https://app.cal.com"
      });

      window.Cal?.ns?.[namespace]?.("inline", {
        elementOrSelector: "#my-cal-inline-15min",
        config: {
          layout: "month_view",
          useSlotsViewOnSmallScreen: true
        },
        calLink
      });

      window.Cal?.ns?.[namespace]?.("ui", {
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    };

    initCal();
  }, []);

  return (
    <div className={styles.calWrapper}>
      {!compact ? (
        <div className={styles.bookingIntro}>
          <div className={styles.bookingKicker}>{messages.booking.kicker}</div>
          <h3>{messages.booking.title}</h3>
          <p>{messages.booking.copy}</p>
        </div>
      ) : null}

      <div className={styles.calFrame} id="my-cal-inline-15min" />
    </div>
  );
}
