'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setError('Enter a valid 6-digit PIN.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Login failed.');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--cream)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'var(--cream-card)',
            border: '1px solid var(--stone-200)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          }}
        >
          {/* Icon + Title */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div
              className="w-14 h-14 rounded-[14px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--amber-400), var(--amber-600))',
                boxShadow: 'var(--shadow-amber)',
              }}
            >
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h1
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '1.6rem',
                  color: 'var(--stone-900)',
                  lineHeight: 1.1,
                }}
              >
                Admin Access
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--stone-500)' }}>
                Enter your 6-digit admin PIN
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="● ● ● ● ● ●"
                value={pin}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPin(v);
                  setError('');
                }}
                className="w-full px-4 py-3 pr-12 rounded-xl text-center text-2xl tracking-[0.6rem] font-mono outline-none transition-all"
                style={{
                  background: 'var(--cream)',
                  border: `1.5px solid ${error ? '#ef4444' : 'var(--stone-200)'}`,
                  color: 'var(--stone-900)',
                }}
                autoFocus
                autoComplete="off"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: 'var(--stone-400)' }}
                onClick={() => setShowPin((v) => !v)}
                tabIndex={-1}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: '#ef4444' }}>
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || pin.length !== 6}
              className="w-full"
              style={{
                background: 'linear-gradient(135deg, var(--amber-500), var(--amber-600))',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying…
                </>
              ) : (
                'Enter Admin Panel'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
