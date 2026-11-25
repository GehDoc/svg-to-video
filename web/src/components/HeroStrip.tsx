import { useState, useEffect } from 'react';
import seoData from '../data/seoDocumentation.json';
import './HeroStrip.scss';

export const HeroStrip = () => {
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsStuck(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      className={`hero-strip ${isStuck ? 'is-stuck' : ''}`}
      aria-label="Introduction"
    >
      <div className="hero-strip-inner">
        <h1>{seoData.headline}</h1>
        <p>{seoData.tagline}</p>
      </div>
    </section>
  );
};
