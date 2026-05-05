"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type Locale = "en" | "el";

type Messages = {
  nav: {
    book: string;
    services: string;
    contact: string;
    mobileHint: string;
    instagram: string;
    bookVisit: string;
    location: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    copy: string;
    details: [string, string, string];
    ctaPrimary: string;
    ctaSecondary: string;
    metrics: [string, string, string, string];
    bookingBadge: string;
    bookingTitle: string;
    bookingCopy: string;
    bookingFooter: [string, string];
  };
  booking: {
    kicker: string;
    title: string;
    copy: string;
  };
  services: {
    kicker: string;
    title: string;
    copy: string;
    items: Array<{
      code: string;
      title: string;
      description: string;
    }>;
  };
  contact: {
    kicker: string;
    title: string;
    copy: string;
    lead: string;
    visitUs: string;
    instagram: string;
    atmosphere: string;
    atmosphereCopy: string;
    directions: string;
    supportKicker: string;
    supportTitle: string;
    supportCopy: string;
    supportInstagram: string;
    supportBooking: string;
  };
  footer: string;
};

const messages: Record<Locale, Messages> = {
  en: {
    nav: {
      book: "Book",
      services: "Services",
      contact: "Contact",
      mobileHint: "Go to section",
      instagram: "View Instagram",
      bookVisit: "Book Your Visit",
      location: "Keratsini, Athens",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu"
    },
    hero: {
      eyebrow: "CrossFit Box in Keratsini",
      titleLead: "Book First.",
      titleAccent: "Unleash Your Inner Hero.",
      copy:
        "The main point of Superheroes Crossbox is simple: reserve your first visit now and step straight into a bold training environment built around power, discipline, and transformation.",
      details: ["Live Booking", "CrossFit & Strength", "Theofrastou 68, Keratsini"],
      ctaPrimary: "Book Your Visit",
      ctaSecondary: "Explore Programs",
      metrics: [
        "Book instantly and lock in your first on-site training experience.",
        "Coach-led intensity with real accountability and structure.",
        "Hero-inspired atmosphere with a striking Hulk wall identity.",
        "Programs for athletes, ambitious beginners, and hybrids."
      ],
      bookingBadge: "Priority Booking",
      bookingTitle: "Reserve your first session now.",
      bookingCopy: "Pick a slot now. Everything else on the page supports this decision.",
      bookingFooter: ["@superheroescrossbox", "Keratsini, Athens"]
    },
    booking: {
      kicker: "Book A Visit",
      title: "Book your 1 hour training and see yourself change.",
      copy:
        "Pick a time, meet the team, and get a feel for the training environment before your first full session."
    },
    services: {
      kicker: "Services",
      title: "Programs that turn pressure into performance.",
      copy:
        "Every session is built to feel sharp, demanding, and intelligently structured so your output keeps climbing without sacrificing technique.",
      items: [
        {
          code: "CF",
          title: "CrossFit Classes",
          description:
            "High-energy coached sessions that blend conditioning, gymnastics, and barbell work into full-spectrum performance."
        },
        {
          code: "ST",
          title: "Strength Training",
          description:
            "Structured lifting blocks focused on force production, movement quality, progressive overload, and durability."
        },
        {
          code: "PC",
          title: "Personal Coaching",
          description:
            "One-to-one programming and movement coaching built around your goals, schedule, and recovery capacity."
        },
        {
          code: "OG",
          title: "Open Gym",
          description:
            "Independent training access with premium equipment, clean flow, and space to execute your own protocol."
        }
      ]
    },
    contact: {
      kicker: "Contact",
      title: "Your next level starts now.",
      copy:
        "Bring the ambition. We'll bring the structure, energy, and coaching to turn commitment into momentum.",
      lead:
        "This is more than a workout floor. Superheroes Crossbox is built for people who want disciplined training, visible progress, and a space with unmistakable superhero character from the first second.",
      visitUs: "Visit Us",
      instagram: "Instagram",
      atmosphere: "Atmosphere",
      atmosphereCopy: "Bold CrossFit energy, premium coaching, strong community.",
      directions: "Directions",
      supportKicker: "Before You Book",
      supportTitle: "Get a feel for the gym, then jump back to the scheduler above.",
      supportCopy:
        "Explore the atmosphere, check the Instagram presence, and when you're ready, use the booking panel at the top of the page to secure your first training session.",
      supportInstagram: "View Instagram",
      supportBooking: "Jump To Booking"
    },
    footer: "Superheroes Crossbox. Strength with purpose."
  },
  el: {
    nav: {
      book: "Κράτηση",
      services: "Υπηρεσίες",
      contact: "Επικοινωνία",
      mobileHint: "Μετάβαση",
      instagram: "Instagram",
      bookVisit: "Κλείσε Ραντεβού",
      location: "Κερατσίνι, Αθήνα",
      openMenu: "Άνοιγμα μενού πλοήγησης",
      closeMenu: "Κλείσιμο μενού πλοήγησης"
    },
    hero: {
      eyebrow: "CrossFit Box στο Κερατσίνι",
      // titleLead: "Κλείσε Πρώτα.",
      titleAccent: "Unleash Your Inner Hero.",
      copy:
        "Το βασικό σημείο του Superheroes Crossbox είναι απλό: κλείσε τώρα την πρώτη σου επίσκεψη και μπες κατευθείαν σε ένα δυναμικό περιβάλλον προπόνησης χτισμένο πάνω στη δύναμη, την πειθαρχία και τη μεταμόρφωση.",
      details: ["Άμεση Κράτηση", "CrossFit & Strength", "Θεόφραστου 68, Κερατσίνι"],
      ctaPrimary: "Κλείσε Ραντεβού",
      ctaSecondary: "Δες Τα Προγράμματα",
      metrics: [
        "Κλείσε άμεσα και εξασφάλισε την πρώτη σου προπονητική εμπειρία στον χώρο μας.",
        "Προπόνηση με καθοδήγηση, λογοδοσία και πραγματική δομή.",
        "Hero-inspired ατμόσφαιρα με έντονη Hulk ταυτότητα στον χώρο.",
        "Προγράμματα για αθλητές, αρχάριους με φιλοδοξία και υβριδικούς trainees."
      ],
      bookingBadge: "Κύρια Κράτηση",
      bookingTitle: "Κλείσε τώρα την πρώτη σου συνεδρία.",
      bookingCopy: "Διάλεξε ώρα τώρα. Όλα τα υπόλοιπα στη σελίδα υποστηρίζουν αυτή την απόφαση.",
      bookingFooter: ["@superheroescrossbox", "Κερατσίνι, Αθήνα"]
    },
    booking: {
      kicker: "Κλείσε Επίσκεψη",
      title: "Κλείσε 1 ώρα προπόνηση και δες τον εαυτό σου να αλλάζει.",
      copy:
        "Διάλεξε ώρα, γνώρισε την ομάδα και πάρε μια πραγματική εικόνα του χώρου πριν από την πρώτη σου ολοκληρωμένη προπόνηση."
    },
    services: {
      kicker: "Υπηρεσίες",
      title: "Προγράμματα που μετατρέπουν την πίεση σε απόδοση.",
      copy:
        "Κάθε session είναι σχεδιασμένο ώστε να είναι απαιτητικό, σωστά δομημένο και αποδοτικό, για να ανεβαίνει η απόδοσή σου χωρίς να χάνεται η τεχνική.",
      items: [
        {
          code: "CF",
          title: "CrossFit Classes",
          description:
            "Υψηλής έντασης προπονήσεις με καθοδήγηση που συνδυάζουν conditioning, gymnastics και barbell work."
        },
        {
          code: "ST",
          title: "Strength Training",
          description:
            "Δομημένα blocks ενδυνάμωσης με στόχο τη δύναμη, την ποιότητα κίνησης, την πρόοδο και την ανθεκτικότητα."
        },
        {
          code: "PC",
          title: "Personal Coaching",
          description:
            "Προσωποποιημένος προγραμματισμός και καθοδήγηση σύμφωνα με τους στόχους, το πρόγραμμα και την αποκατάστασή σου."
        },
        {
          code: "OG",
          title: "Open Gym",
          description:
            "Ανεξάρτητη προπόνηση με πρόσβαση σε premium εξοπλισμό, καθαρό χώρο και σωστή ροή για το δικό σου protocol."
        }
      ]
    },
    contact: {
      kicker: "Επικοινωνία",
      title: "Το επόμενο επίπεδό σου ξεκινά τώρα.",
      copy:
        "Φέρε τη φιλοδοξία. Εμείς φέρνουμε τη δομή, την ενέργεια και την καθοδήγηση για να μετατρέψουμε τη συνέπεια σε momentum.",
      lead:
        "Αυτός ο χώρος είναι κάτι παραπάνω από ένα γυμναστήριο. Το Superheroes Crossbox είναι για ανθρώπους που θέλουν πειθαρχημένη προπόνηση, ορατή πρόοδο και έντονο superhero χαρακτήρα από το πρώτο δευτερόλεπτο.",
      visitUs: "Θα Μας Βρεις",
      instagram: "Instagram",
      atmosphere: "Ατμόσφαιρα",
      atmosphereCopy: "Δυνατό CrossFit energy, premium coaching και ισχυρή κοινότητα.",
      directions: "Οδηγίες",
      supportKicker: "Πριν Την Κράτηση",
      supportTitle: "Πάρε μια αίσθηση του gym και μετά γύρνα στο scheduler πιο πάνω.",
      supportCopy:
        "Δες την ατμόσφαιρα, το Instagram και όταν είσαι έτοιμος, χρησιμοποίησε το booking panel στην κορυφή της σελίδας για να κλείσεις την πρώτη σου προπόνηση.",
      supportInstagram: "Δες Instagram",
      supportBooking: "Πήγαινε Στην Κράτηση"
    },
    footer: "Superheroes Crossbox. Δύναμη με σκοπό."
  }
};

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const storedLocale = window.localStorage.getItem("shcb-locale");

    if (storedLocale === "en" || storedLocale === "el") {
      setLocale(storedLocale);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("shcb-locale", locale);
    document.documentElement.lang = locale === "el" ? "el" : "en";
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      messages: messages[locale]
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}
