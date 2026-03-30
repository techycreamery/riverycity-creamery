import React, { useEffect, useRef, useState } from 'react';
import heroMovie from '../assets/hero_movie_optimized.mp4';
import cottonCandyMovie from '../assets/cotton_candy_movie_optimized.mp4';
import textLogo from '../assets/Text Logo.png';
import SiteHeader from './SiteHeader';

function Header({ openCart, cartCount = 0 }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const heroVideoRef = useRef(null);
  const heroVideos = [heroMovie, cottonCandyMovie];

  useEffect(() => {
    const videoElement = heroVideoRef.current;

    if (!videoElement) {
      return undefined;
    }

    videoElement.load();

    const playPromise = videoElement.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }

    return undefined;
  }, [activeVideoIndex]);

  return (
    <header className="hero">
      <div className="section">
        <SiteHeader
          openCart={openCart}
          cartCount={cartCount}
          exploreHref="#explore-flavors"
          secondaryLink={{ href: '/login', label: 'Rewards' }}
        />
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>Take-home pints, custom cakes, and party boxes built for immediate checkout.</h1>
            <p>
              The homepage should drive one thing first: purchases. Start an order for
              freezer stock, celebration cakes, and party-ready dessert kits, then learn
              more about the creamery after that.
            </p>
            <div className="feature-pills">
              <span>Take-home pints</span>
              <span>Custom cakes</span>
              <span>Party in a box</span>
            </div>
            <div className="hero-actions">
              <a className="button button-primary" href="/order">
                Start Order
              </a>
              <a className="button button-secondary" href="/order#delivery">
                Delivery Partners
              </a>
              <a className="button button-secondary" href="/about">
                Our Story
              </a>
            </div>
          </div>

          <div className="hero-card hero-media-card" aria-label="River City Creamery hero video">
            <video
              key={heroVideos[activeVideoIndex]}
              ref={heroVideoRef}
              className="hero-video"
              autoPlay
              muted
              defaultMuted
              playsInline
              preload="metadata"
              poster={textLogo}
              onEnded={() => {
                setActiveVideoIndex((currentIndex) => (currentIndex + 1) % heroVideos.length);
              }}
            >
              <source src={heroVideos[activeVideoIndex]} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
