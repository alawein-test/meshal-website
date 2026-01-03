import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PublicHeader } from '@/components/shared/PublicHeader';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import JulesBackground from '@/components/JulesBackground';
import PixelNinja from '@/components/PixelNinja';
import CRTOverlay from '@/components/CRTOverlay';
import ClickEffectsManager from '@/components/ClickEffectsManager';
import HeroNinjas from '@/components/HeroNinjas';
import { SEO } from '@/components/shared/SEO';
import { JsonLd, schemas } from '@/components/shared/JsonLd';

const Portfolio = () => {
  const location = useLocation();

  // Handle hash scrolling from landing page
  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-jules-dark text-foreground overflow-hidden">
      <SEO
        title="Portfolio"
        description="Explore the projects and work of M. Alawein - Scientific computing platforms, AI research tools, and enterprise solutions."
        keywords={['portfolio', 'projects', 'scientific computing', 'AI research', 'simulations']}
      />
      <JsonLd schema={schemas.person} />
      <JulesBackground />
      <CRTOverlay />
      <ClickEffectsManager />
      <PixelNinja />
      <PublicHeader />
      <main className="relative z-10">
        <HeroSection />
        {/* Fighting Ninjas */}
        <div className="relative -mt-32 mb-16 flex justify-center">
          <HeroNinjas />
        </div>
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
