import React from 'react';


const EmailAuthForm: React.FC = () => (
  <form className="flex flex-col gap-3 w-80 bg-black/40 rounded-xl p-4 border border-gold/10 shadow-inner">
    <input
      type="email"
      placeholder="Enter your email address"
      className="px-4 py-2 rounded-lg border border-gold/30 bg-gray-900/80 text-gold placeholder-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
      required
    />
    <button
      type="submit"
      className="bg-gradient-to-r from-gold to-yellow-400 text-black font-extrabold py-2 rounded-lg shadow hover:from-yellow-400 hover:to-gold transition uppercase tracking-wider"
    >
      Sign in with Email
    </button>
  </form>
);

export default EmailAuthForm;
