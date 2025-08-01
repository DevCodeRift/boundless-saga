import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import AuthenticationModal from '../components/auth/AuthenticationModal';

// Homepage component with murim aesthetics
// Uses Tailwind classes and custom backgrounds/animations from globals.css
// This is the main landing page for the game, featuring animated backgrounds and entry points for authentication.


const HomePage: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-void via-shadow to-obsidian font-cultivation">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="qi-particles" />
        <div className="floating-runes" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <Header />
        <HeroSection />
        <AuthenticationModal />
      </div>
    </div>
  );
};

export default HomePage;
