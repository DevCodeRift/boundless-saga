import React, { useState } from 'react';
import EmailAuthForm from './EmailAuthForm';
import DiscordAuthButton from './DiscordAuthButton';
import AuthToggle from './AuthToggle';


// Authentication modal for murim game
// Supports switching between email and Discord OAuth authentication
const AuthenticationModal: React.FC = () => {
  const [authMode, setAuthMode] = useState<'email' | 'discord'>('email');

  return (
    <div className="mt-8 flex flex-col items-center bg-obsidian/90 backdrop-blur-xl border border-jade/20 rounded-xl p-8 shadow-2xl">
      <h2 className="text-gold font-ancient text-2xl mb-4">Enter the Cultivation Realm</h2>
      {authMode === 'email' && <EmailAuthForm />}
      {authMode === 'discord' && <DiscordAuthButton />}
      <AuthToggle authMode={authMode} setAuthMode={setAuthMode} />
    </div>
  );
};

export default AuthenticationModal;
