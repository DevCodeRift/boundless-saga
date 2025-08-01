import React, { useState } from 'react';

// Email authentication form for murim game

type Mode = 'register' | 'login';

const EmailAuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('register');


  // Device fingerprinting utility (simple version)
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

  // Browser fingerprint (simple)
  const generateBrowserFingerprint = () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const deviceFingerprint = generateDeviceFingerprint();
      const browserFingerprint = generateBrowserFingerprint();
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          deviceFingerprint,
          browserFingerprint
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (mode === 'register' ? 'Registration failed' : 'Login failed'));
      } else {
        setError(null);
        alert(mode === 'register' ? 'Registration successful!' : 'Login successful!');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
      <input
        type="email"
        className="form-input rounded bg-obsidian/80 border border-mist text-silver placeholder-mist focus:border-jade focus:ring-jade"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="form-input rounded bg-obsidian/80 border border-mist text-silver placeholder-mist focus:border-jade focus:ring-jade"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-jade text-void font-bold py-2 rounded hover:bg-emerald transition-all"
        disabled={loading}
      >
        {loading ? (mode === 'register' ? 'Registering...' : 'Logging in...') : (mode === 'register' ? 'Register' : 'Login')}
      </button>
      <button
        type="button"
        className="text-xs text-mist underline hover:text-jade mt-1"
        onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
      >
        {mode === 'register' ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
      {error && <div className="text-crimson text-sm text-center">{error}</div>}
    </form>
  );
};

export default EmailAuthForm;
