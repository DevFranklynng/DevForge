import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Hammer } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { GoogleButton } from "@/features/auth/GoogleButton";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

export function Login() {
  const { status, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const googleError = searchParams.get("google_error");

  useEffect(() => {
    // After a Google OAuth redirect the session cookie is already set.
    if (status === "authenticated") {
      navigate(from, { replace: true });
    }
  }, [status, navigate, from]);

  useEffect(() => {
    if (!googleError) return;
    const message =
      googleError === "not_configured"
        ? "Google sign-in is not configured on this server yet."
        : googleError;
    toast.error(message);
    setSearchParams({}, { replace: true });
  }, [googleError, toast, setSearchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-edge-strong bg-surface-2">
          <Hammer className="h-4 w-4 text-accent" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Sign in to DevForge</p>
          <p className="text-xs text-ink-muted">Welcome back</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-edge bg-surface p-5">
        <Field label="Email" htmlFor="login-email">
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@company.com"
          />
        </Field>

        <Field label="Password" htmlFor="login-password">
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </Field>

        {error && (
          <p role="alert" className="rounded border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" full width="full" loading={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3 text-[11px] text-ink-muted">
        <span className="h-px flex-1 bg-edge" />
        or
        <span className="h-px flex-1 bg-edge" />
      </div>

      <GoogleButton />

      {import.meta.env.DEV && (
        <button
          onClick={() => {
            setForm({ email: "demo@devforge.dev", password: "devforge123" });
            setError("");
          }}
          className="mt-3 w-full rounded-md border border-dashed border-edge px-3 py-2 text-center text-xs text-ink-secondary transition-colors hover:border-accent/50 hover:text-accent btn-focus"
        >
          Use demo credentials — demo@devforge.dev / devforge123
        </button>
      )}

      <p className="mt-5 text-center text-xs text-ink-muted">
        New to DevForge?{" "}
        <Link to="/register" className="font-medium text-accent hover:text-accent-strong hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}