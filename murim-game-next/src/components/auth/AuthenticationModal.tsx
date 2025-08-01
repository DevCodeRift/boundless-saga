import React from 'react';
import DiscordAuthButton from './DiscordAuthButton';
import EmailAuthForm from './EmailAuthForm';

const AuthenticationModal: React.FC = () => (
  <div className="mt-8 flex flex-col items-center gap-4">
    <DiscordAuthButton />
    <EmailAuthForm />
  </div>
);

export default AuthenticationModal;
