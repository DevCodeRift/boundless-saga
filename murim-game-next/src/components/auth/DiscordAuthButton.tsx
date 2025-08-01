"use client";
import React from 'react';


const DiscordAuthButton: React.FC = () => {
  const handleDiscordLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || process.env.DISCORD_REDIRECT_URI;
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
      Sign in with Discord
    </button>
  );
};

export default DiscordAuthButton;
