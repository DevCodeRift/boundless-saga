import React from 'react';

const EmailAuthForm: React.FC = () => (
  <form className="flex flex-col gap-2 w-72">
    <input
      type="email"
      placeholder="Email"
      className="px-4 py-2 rounded border border-gray-700 bg-gray-900 text-white focus:outline-none"
      required
    />
    <button
      type="submit"
      className="bg-gold text-black font-bold py-2 rounded hover:bg-yellow-400 transition"
    >
      Sign in with Email
    </button>
  </form>
);

export default EmailAuthForm;
