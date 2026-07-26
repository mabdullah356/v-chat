import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/users/register", {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess(data.message);

      setTimeout(() => {
        navigate(`/chat/${data.user.username}`);
      }, 800);
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <article className="w-full max-w-sm">
        <nav className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight text-lg">
            V-Chat
          </span>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create your account
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Fill in the details below to get started
          </p>
        </header>

        {error && (
          <aside className="mb-5 px-4 py-2.5 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm" role="alert">
            {error}
          </aside>
        )}

        {success && (
          <aside className="mb-5 px-4 py-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm" role="status">
            {success}
          </aside>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-4 border-0 p-0 m-0">
            <div>
              <label
                htmlFor="fullName"
                className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 block"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Abdullah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 block"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="abdullah"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 block"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 pr-10 bg-white border border-gray-200 rounded-md text-gray-900 text-sm placeholder-gray-400 outline-none transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white font-medium rounded-md text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Sign in
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-4">
            By continuing, you agree to V-Chat&apos;s{" "}
            <a href="/terms" className="underline hover:text-gray-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-gray-500">
              Privacy Policy
            </a>.
          </p>
        </footer>
      </article>
    </main>
  );
};

export default Signup;
