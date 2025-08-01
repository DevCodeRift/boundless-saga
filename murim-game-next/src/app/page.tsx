import React from 'react';
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import AuthenticationModal from '../components/auth/AuthenticationModal';
import './globals.css';

const Home = () => {
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

export default Home;
