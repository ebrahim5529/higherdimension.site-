import { Head } from "@inertiajs/react";
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { AdvantagesSection } from "@/components/landing/AdvantagesSection";
import { ContactSection } from "@/components/landing/ContactSection";

export default function Home() {
  return (
    <>
      <Head title="شركة البعد العالي للتجارة - تأجير الجيكات والسقالات" />
      <Layout>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <AdvantagesSection />
        <ContactSection />
      </Layout>
    </>
  );
}
