import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNeedsConfirmation(false);
    setLoading(true);

    try {
      await signUp(email, password, displayName || undefined);
      // signUp resolves without error. Check if we got a session
      // (i.e. email confirmation is disabled) or need to confirm.
      // The AuthContext's onAuthStateChange will fire if user is immediately available.
      // We can try navigating — ProtectedRoute will redirect to login if not authed yet.
      
      // Small delay to allow auth state to propagate
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 600);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      // Supabase returns specific messages for email confirmation
      if (message.toLowerCase().includes('confirm') || message.toLowerCase().includes('check your email')) {
        setNeedsConfirmation(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030509] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Deep atmospheric base glow */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gh-accent-blue/5 via-[#030509] to-[#030509] pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gh-accent-purple/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-gh-accent-blue/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo and tagline */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#080b12]/80 backdrop-blur-xl border border-gh-border/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)] relative">
              <div className="absolute inset-0 bg-gh-accent-blue/10 blur-md rounded-2xl" />
              <Zap className="w-6 h-6 text-gh-accent-blue relative z-10" />
            </div>
            <h1 className="text-4xl font-extrabold text-gh-text tracking-tighter">
              Deadline<span className="text-transparent bg-clip-text bg-gradient-to-r from-gh-accent-blue to-gh-accent-purple">AI</span>
            </h1>
          </div>
          <p className="text-gh-text-tertiary text-xs uppercase tracking-widest font-semibold">
            Command Center Registration
          </p>
        </div>

        {/* Signup card */}
        <div className="bg-[#080b12]/80 backdrop-blur-2xl border border-gh-border/50 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gh-accent-blue/5 to-transparent pointer-events-none" />

          <h2 className="text-lg font-semibold text-gh-text mb-6 text-center relative z-10">
            Create your account
          </h2>

          {needsConfirmation && (
            <div className="flex items-center gap-2 bg-green-900/20 border border-green-900/40 rounded-lg px-4 py-3 mb-6 relative z-10">
              <CheckCircle2 className="w-4 h-4 text-gh-accent-green flex-shrink-0" />
              <p className="text-sm text-gh-accent-green">
                Account created! Check your email for a verification link.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-900/40 rounded-lg px-4 py-3 mb-6 relative z-10">
              <AlertCircle className="w-4 h-4 text-gh-accent-red flex-shrink-0" />
              <p className="text-sm text-gh-accent-red">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-gh-text-secondary mb-2">
                Display name
              </label>
              <input
                id="signup-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="input-field bg-gh-bg/50 border-gh-border/50"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gh-text-secondary mb-2">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="input-field bg-gh-bg/50 border-gh-border/50"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gh-text-secondary mb-2">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
                className="input-field bg-gh-bg/50 border-gh-border/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || needsConfirmation}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 py-3"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creating account…' : 'Initialize Account'}
            </button>
          </form>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-gh-text-secondary mt-8 relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-gh-accent-blue hover:text-gh-accent-purple transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
