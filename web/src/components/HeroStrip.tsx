import seoData from '../data/seoDocumentation.json';
import { StickyHeader } from './StickyHeader/StickyHeader';
import './HeroStrip.scss';

export const HeroStrip = () => {
  return (
    <StickyHeader as="section" className="hero-strip" aria-label="Introduction">
      <div className="hero-strip-inner">
        <h1>{seoData.headline}</h1>
        <p>{seoData.tagline}</p>
      </div>
    </StickyHeader>
  );
};
