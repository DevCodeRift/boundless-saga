import React from 'react';

// Toggle between email and Discord authentication modes
const AuthToggle: React.FC<{ authMode: 'email' | 'discord'; setAuthMode: (mode: 'email' | 'discord') => void }> = ({ authMode, setAuthMode }) => (
  <div className="flex gap-2 mt-4">
    <button
      className={`px-4 py-1 rounded font-bold border transition-all ${authMode === 'email' ? 'bg-jade text-void border-jade' : 'bg-obsidian text-mist border-mist hover:bg-shadow'}`}
      onClick={() => setAuthMode('email')}
      type="button"
    >
      Email
    </button>
    <button
      className={`px-4 py-1 rounded font-bold border transition-all ${authMode === 'discord' ? 'bg-azure text-silver border-azure' : 'bg-obsidian text-mist border-mist hover:bg-shadow'}`}
      onClick={() => setAuthMode('discord')}
      type="button"
    >
      Discord
    </button>
  </div>
);

export default AuthToggle;
