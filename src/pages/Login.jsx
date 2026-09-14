import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Building2 } from "lucide-react";
import { login } from "../api/apiClient";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/listings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EFEAE0] lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-[#16231D] lg:flex lg:min-h-screen lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(169,121,60,0.15),transparent_35%)]" />

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A9793C] text-[#16231D]">
              <Building2 size={20} />
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#FBF8F2]">Ivy Homes</span>
          </div>
        </div>

        <div className="relative z-10 max-w-xl p-10 pb-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[#A9793C]">
            Find your next home
          </p>

          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-[#FBF8F2]">
            Better homes.
            <br />
            Better decisions.
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-[#9CA39C]">
            Explore properties, save the ones you love, and make smarter
            decisions with real estate insights.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-12 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16231D] text-[#A9793C]">
              <Building2 size={20} />
            </div>
            <span className="text-xl font-semibold tracking-tight text-[#16231D]">Ivy Homes</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-[#16231D]">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-[#7A7568]">
              Sign in to continue exploring homes in Mumbai.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#3A473F]">
                Email address
              </label>
              <div className="relative">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A39D8C]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl border border-[#DED2B0] bg-white pl-11 pr-4 text-sm text-[#16231D] outline-none transition placeholder:text-[#A39D8C] focus:border-[#A9793C] focus:ring-4 focus:ring-[#A9793C]/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#3A473F]">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A39D8C]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-12 w-full rounded-xl border border-[#DED2B0] bg-white pl-11 pr-12 text-sm text-[#16231D] outline-none transition placeholder:text-[#A39D8C] focus:border-[#A9793C] focus:ring-4 focus:ring-[#A9793C]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#A39D8C] transition hover:bg-[#EFEAE0] hover:text-[#16231D]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-[#A6432E]/30 bg-[#A6432E]/5 px-4 py-3 text-sm text-[#A6432E]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#16231D] text-sm font-medium text-white transition hover:bg-[#A9793C] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && (
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;