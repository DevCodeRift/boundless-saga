import React from 'react';

import React, { useState } from 'react';

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || '';
const REDIRECT_URI = window.location.origin + '/discord-oauth-callback';

// Utility functions (same as in EmailAuthForm)
const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  const fingerprint = {
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    canvas: canvas.toDataURL(),
    userAgent: navigator.userAgent,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack
  };
  return btoa(JSON.stringify(fingerprint));
};
const generateBrowserFingerprint = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
};

const DiscordAuthButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Redirect to Discord OAuth
  const handleDiscordLogin = () => {
    setError(null);
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: 'identify email',
      prompt: 'consent',
    });
    window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`;
  };

  // Step 2: Handle callback (should be in a useEffect in a callback page/component)
  // This is a placeholder for the callback handler logic

  return (
    <button
      onClick={handleDiscordLogin}
      className="w-full flex items-center justify-center gap-2 bg-azure text-silver font-bold py-2 rounded hover:bg-blue-700 transition-all mt-4"
      disabled={loading}
    >
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.07.07 0 0 0-.073.035c-.211.375-.444.864-.608 1.249-1.844-.276-3.68-.276-5.486 0-.164-.393-.405-.874-.617-1.249a.07.07 0 0 0-.073-.035c-1.67.285-3.27.822-4.885 1.515a.064.064 0 0 0-.03.027C.533 7.13-.32 9.725.099 12.275c.002.014.01.028.021.037a19.978 19.978 0 0 0 5.993 3.036.07.07 0 0 0 .076-.027c.461-.63.873-1.295 1.226-1.994a.07.07 0 0 0-.038-.098 13.087 13.087 0 0 1-1.872-.893.07.07 0 0 1-.007-.116c.126-.094.252-.192.371-.291a.07.07 0 0 1 .073-.01c3.927 1.793 8.18 1.793 12.061 0a.07.07 0 0 1 .074.009c.12.099.245.197.372.291a.07.07 0 0 1-.006.116 12.64 12.64 0 0 1-1.873.893.07.07 0 0 0-.037.098c.36.699.772 1.364 1.225 1.994a.07.07 0 0 0 .076.028 19.978 19.978 0 0 0 5.994-3.036.07.07 0 0 0 .021-.037c.5-3.177-.838-5.747-3.548-7.879a.061.061 0 0 0-.03-.028z"/></svg>
      {loading ? 'Connecting...' : 'Login with Discord'}
    </button>
  );
};

export default DiscordAuthButton;
