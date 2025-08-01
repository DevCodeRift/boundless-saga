import React from 'react';
import DiscordAuthButton from './DiscordAuthButton';
import EmailAuthForm from './EmailAuthForm';


const AuthenticationModal: React.FC = () => (
  <div className="mt-12 flex flex-col items-center gap-6 w-full max-w-md bg-gradient-to-br from-void/80 via-shadow/70 to-obsidian/80 rounded-2xl p-8 shadow-2xl border border-gold/20 backdrop-blur-md">
    <div className="flex flex-col gap-3 w-full">
      <DiscordAuthButton mode="signup" />
      <span className="text-center text-gray-400 text-xs tracking-widest uppercase">or</span>
      <DiscordAuthButton mode="signin" />
    </div>
    <div className="w-full border-t border-gold/20 my-4" />
    <EmailAuthForm />
  </div>
);

export default AuthenticationModal;
