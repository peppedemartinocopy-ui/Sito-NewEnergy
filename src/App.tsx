import { useHashScroll } from '@/lib/useHashScroll';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { WhyUs } from '@/components/WhyUs';
import { Reviews } from '@/components/Reviews';
import { Gustavo } from '@/components/Gustavo';
import { Gallery } from '@/components/Gallery';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';
import { ContactInfo } from '@/components/ContactInfo';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

function App() {
  // Link con ancora (es. annunci su /#contattaci): atterraggio affidabile, vedi src/lib/useHashScroll.ts
  useHashScroll();

  return (
    <div className="min-h-screen bg-white text-ink-900 font-body">
      <Header />
      <main>
        <Hero />
        <Reviews />
        <WhyUs />
        <Gustavo />
        <Contact />
        <Gallery />
        <FAQ />
        <ContactInfo />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default App;
