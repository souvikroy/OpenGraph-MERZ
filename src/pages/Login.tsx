import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('james.mitchell@merz.ae');
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    if (code !== 'MERZ-ALLYSAI-2026' && code !== '') {
      setError('Invalid access code. Use MERZ-ALLYSAI-2026 for demo.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-merz-teal via-merz-teal-dark to-slate-800 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-merz-teal to-merz-teal-dark px-8 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">AllysAI × Merz</p>
                <p className="text-white/70 text-xs">AI Platform for Merz Middle East</p>
              </div>
            </div>
            <h1 className="text-white text-xl font-semibold">Welcome back</h1>
            <p className="text-white/70 text-sm mt-1">Sign in to access your AI Sales Platform</p>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label flex items-center gap-1.5">
                  <Mail size={11} />
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@merz.ae"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label flex items-center gap-1.5">
                  <Lock size={11} />
                  Access Code
                </label>
                <div className="relative">
                  <input
                    type={showCode ? 'text' : 'password'}
                    className="form-input pr-10"
                    placeholder="MERZ-ALLYSAI-2026"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[11px] text-merz-slate-light mt-1">Demo: use MERZ-ALLYSAI-2026 or leave blank</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-3 text-base"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-6 flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg border border-merz-border">
              <Shield size={14} className="text-merz-teal shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-merz-slate">Secure & Compliant</p>
                <p className="text-[11px] text-merz-slate-light leading-relaxed">
                  Hosted on Azure UAE North. All data remains within UAE borders. Compliant with Merz global data policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/50 text-xs mt-6">
          AllysAI × Merz Middle East · Confidential · Version 1.0 · April 2026
        </p>
      </div>
    </div>
  );
}
