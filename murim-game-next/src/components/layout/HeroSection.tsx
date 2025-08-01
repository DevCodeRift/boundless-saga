import React from 'react';


const HeroSection: React.FC = () => (
  <section className="flex flex-col items-center mt-8 mb-10 animate-fade-in">
    <h2 className="text-3xl md:text-4xl font-extrabold text-gold drop-shadow-glow mb-4 tracking-wider uppercase">
      Awaken Your Qi. Forge Your Destiny.
    </h2>
    <p className="text-lg md:text-xl text-gray-200 max-w-2xl text-center font-light backdrop-blur-sm">
      Step into a futuristic Murim world where ancient martial arts meet advanced technology. Harness mystical powers, battle rival clans, and ascend the path of cultivation. <span className="text-gold font-semibold">Will you become a legend?</span>
    </p>
  </section>
);

export default HeroSection;
