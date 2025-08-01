import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

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

const DiscordOAuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting to Discord...');
  const searchParams = new URLSearchParams(window.location.search);
  // If using react-router-dom, use: const [searchParams] = useSearchParams();
  // const code = searchParams.get('code');
  const code = searchParams.get('code');
  // const navigate = useNavigate();

  useEffect(() => {
    if (!code) {
      setStatus('error');
      setMessage('No code found in URL.');
      return;
    }
    const doAuth = async () => {
      setStatus('loading');
      setMessage('Verifying Discord account...');
      try {
        const deviceFingerprint = generateDeviceFingerprint();
        const browserFingerprint = generateBrowserFingerprint();
        const res = await fetch('/api/auth/discord', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, deviceFingerprint, browserFingerprint })
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus('error');
          setMessage(data.error || 'Discord authentication failed.');
        } else {
          setStatus('success');
          setMessage('Discord authentication successful!');
          // Optionally: navigate('/dashboard') or close modal
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error.');
      }
    };
    doAuth();
  }, [code]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-obsidian/90 p-8 rounded-xl shadow-xl border border-jade/30">
        <h2 className="text-gold font-ancient text-2xl mb-4">Discord Login</h2>
        <p className={status === 'error' ? 'text-crimson' : 'text-mist'}>{message}</p>
      </div>
    </div>
  );
};

export default DiscordOAuthCallback;
