
import React, { useState } from 'react';
import DiscordAuthButton from './DiscordAuthButton';
import EmailAuthForm from './EmailAuthForm';

const AuthenticationModal: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | null>(null);

  return (
    <div className="mt-12 flex flex-col items-center gap-6 w-full max-w-md bg-gradient-to-br from-void/80 via-shadow/70 to-obsidian/80 rounded-2xl p-8 shadow-2xl border border-gold/20 backdrop-blur-md">
      {!mode ? (
        <div className="flex flex-col gap-4 w-full">
          <button
            className="bg-gold text-black font-extrabold py-3 rounded-xl shadow hover:bg-yellow-400 transition text-lg uppercase tracking-wider"
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white font-extrabold py-3 rounded-xl shadow hover:from-indigo-900 hover:to-blue-700 transition text-lg uppercase tracking-wider"
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full items-center">
          <div className="flex gap-2 mb-2">
            <button
              className={`px-4 py-1 rounded-full text-xs font-bold ${mode === 'signin' ? 'bg-gold text-black' : 'bg-gray-800 text-gold border border-gold/30'}`}
              onClick={() => setMode('signin')}
            >Sign In</button>
            <button
              className={`px-4 py-1 rounded-full text-xs font-bold ${mode === 'signup' ? 'bg-gold text-black' : 'bg-gray-800 text-gold border border-gold/30'}`}
              onClick={() => setMode('signup')}
            >Sign Up</button>
          </div>
          <DiscordAuthButton mode={mode} />
          <span className="text-center text-gray-400 text-xs tracking-widest uppercase">or</span>
          <EmailAuthForm />
          <button
            className="mt-4 text-xs text-gray-400 hover:text-gold underline"
            onClick={() => setMode(null)}
          >
            &larr; Back
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthenticationModal;
