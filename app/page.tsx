import { ContactSection } from "@/components/ContactSection";
import { HeroSection } from "@/components/HeroSection";
import { LocaleProvider } from "@/components/LocaleProvider";
import { BackToTopButton } from "@/components/BackToTopButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ServicesSection } from "@/components/ServicesSection";
import styles from "@/components/site.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <LocaleProvider>
        <SiteHeader />

        <div id="top">
          <HeroSection />
          <ServicesSection />
          <ContactSection />
        </div>

        <BackToTopButton />
        <SiteFooter />
      </LocaleProvider>
    </main>
  );
}
