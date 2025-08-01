import React from 'react';

// Header component for the murim game UI
// Displays the game title/logo and navigation (future expansion)
const Header: React.FC = () => (
  <header className="w-full flex items-center justify-between px-8 py-4 bg-void/80 border-b border-shadow/40 z-20">
    <span className="text-gold font-ancient text-2xl tracking-widest drop-shadow">Murim Cultivation</span>
    {/* Future: Navigation or user menu */}
  </header>
);

export default Header;
