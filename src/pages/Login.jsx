import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Hammer } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

export function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const fillDemo = () => {
    setForm({ email: "demo@devforge.dev", password: "devforge123" });
    setError("");
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

      <button
        onClick={fillDemo}
        className="mt-3 w-full rounded-md border border-dashed border-edge px-3 py-2 text-center text-xs text-ink-secondary transition-colors hover:border-accent/50 hover:text-accent btn-focus"
      >
        Use demo credentials — demo@devforge.dev / devforge123
      </button>

      <p className="mt-5 text-center text-xs text-ink-muted">
        New to DevForge?{" "}
        <Link to="/register" className="font-medium text-accent hover:text-accent-strong hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}