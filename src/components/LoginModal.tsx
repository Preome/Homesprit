import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface AuthUser {
  name: string;
  email: string;
  role: 'CUSTOMER' | 'AGENT' | 'ADMIN';
  avatar?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('admin@homesprit.com');
  const [password, setPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState('');

  // Demo accounts
  const demoAccounts = [
    {
      role: 'ADMIN' as const,
      label: 'Operations Admin',
      email: 'admin@homesprit.com',
      password: 'admin123',
      name: 'Operations Administrator',
    },
    {
      role: 'AGENT' as const,
      label: 'Listing Agent',
      email: 'julian.thorne@homesprit.com',
      password: 'agent123',
      name: 'Julian Thorne',
    },
    {
      role: 'CUSTOMER' as const,
      label: 'Customer / Buyer',
      email: 'client@homesprit.com',
      password: 'client123',
      name: 'Tasdid Anawaz',
    },
  ];

  const handleFillDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const matched = demoAccounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );

    if (matched) {
      onLoginSuccess({
        name: matched.name,
        email: matched.email,
        role: matched.role,
        avatar: matched.role === 'AGENT'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
          : undefined,
      });
      onClose();
    } else {
      // If custom credentials entered, allow flexible entry as customer
      if (email.includes('@') && password.length >= 4) {
        onLoginSuccess({
          name: email.split('@')[0],
          email: email.trim(),
          role: 'CUSTOMER',
        });
        onClose();
      } else {
        setErrorMessage('Invalid credentials. Please select one of the demo accounts below or enter a valid email.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div 
        className="bg-white border border-neutral-200 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-950">Homesprit Sign In</h3>
              <div className="text-xs text-neutral-500">Access your property portal or admin console</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-neutral-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 pl-8 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                />
                <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 pl-8 bg-neutral-50 border border-neutral-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                />
                <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer shadow-xs"
            >
              Sign In
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="pt-4 border-t border-neutral-200">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Select Demo Credentials to Autofill:
            </div>
            <div className="space-y-1.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleFillDemo(acc)}
                  className={`w-full text-left p-2 rounded border transition-colors flex items-center justify-between cursor-pointer ${
                    email === acc.email
                      ? 'border-neutral-900 bg-neutral-50 font-semibold text-neutral-950'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold">{acc.label}</div>
                    <div className="text-[11px] text-neutral-500 font-mono">{acc.email} · pass: {acc.password}</div>
                  </div>
                  {email === acc.email && <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
