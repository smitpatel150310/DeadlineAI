import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
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
            Command Center Authentication
          </p>
        </div>

        {/* Login card */}
        <div className="bg-[#080b12]/80 backdrop-blur-2xl border border-gh-border/50 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gh-accent-blue/5 to-transparent pointer-events-none" />
          
          <h2 className="text-lg font-semibold text-gh-text mb-6 text-center relative z-10">
            Sign in to your account
          </h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-900/40 rounded-lg px-4 py-3 mb-6 relative z-10">
              <AlertCircle className="w-4 h-4 text-gh-accent-red flex-shrink-0" />
              <p className="text-sm text-gh-accent-red">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gh-text-secondary mb-2">
                Email address
              </label>
              <input
                id="login-email"
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
              <label htmlFor="login-password" className="block text-sm font-medium text-gh-text-secondary mb-2">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="input-field bg-gh-bg/50 border-gh-border/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 py-3"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Authenticating…' : 'Initialize Session'}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-gh-text-secondary mt-8 relative z-10">
          New operative?{' '}
          <Link to="/signup" className="text-gh-accent-blue hover:text-gh-accent-purple transition-colors font-medium">
            Request access
          </Link>
        </p>
      </div>
    </div>
  );
}
