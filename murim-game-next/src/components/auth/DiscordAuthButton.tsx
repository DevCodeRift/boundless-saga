"use client";
import React from 'react';



interface DiscordAuthButtonProps {
  mode: 'signup' | 'signin';
}

const DiscordAuthButton: React.FC<DiscordAuthButtonProps> = ({ mode }) => {
  const handleDiscordLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID;
    let redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || process.env.DISCORD_REDIRECT_URI;
    // Append mode as a query param to the redirect_uri
    if (redirectUri) {
      const url = new URL(redirectUri);
      url.searchParams.set('mode', mode);
      redirectUri = url.toString();
    }
    const discordUrl =
      `https://discord.com/oauth2/authorize?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri ?? '')}` +
      `&response_type=code&scope=identify%20email`;
    window.location.href = discordUrl;
  };
  return (
    <button
      className="bg-discord text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-discord-dark transition"
      onClick={handleDiscordLogin}
      type="button"
    >
      {mode === 'signup' ? 'Sign up with Discord' : 'Sign in with Discord'}
    </button>
  );
};

export default DiscordAuthButton;
