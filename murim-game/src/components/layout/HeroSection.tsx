import React from 'react';

// Hero section for the murim game homepage
// Displays a call to action and thematic description
const HeroSection: React.FC = () => (
  <section className="flex flex-col items-center justify-center py-12">
    <h2 className="text-4xl font-ancient text-gold mb-4 drop-shadow">Enter the Cultivation Realm</h2>
    <p className="text-mist text-lg max-w-2xl text-center mb-6">
      Embark on your journey. Master your qi. Rise through the ranks in a futuristic murim world.
    </p>
    {/* Placeholder for future animated elements or call-to-action */}
  </section>
);

export default HeroSection;
