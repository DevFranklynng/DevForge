import { Link } from "react-router-dom";
import {
  FolderKanban,
  ListChecks,
  Github,
  Rocket,
  Braces,
  Bell,
  Sparkles,
  Activity,
  ArrowRight,
  Boxes,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/features/auth/auth-context";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const features = [
  { icon: FolderKanban, title: "Project command", text: "Track every project's status, priority, and progress from one place, with task-derived completion metrics." },
  { icon: ListChecks, title: "Task flow", text: "A kanban board and list view with priorities, due dates, and per-project progress recomputation." },
  { icon: Github, title: "Repository summary", text: "Connect and summarize GitHub repositories with branches, visibility, stars, and open issues." },
  { icon: Rocket, title: "Deployment monitoring", text: "Monitor production, staging, and preview deployments with live build status." },
  { icon: Braces, title: "Living API docs", text: "Document endpoints method-by-method with parameters, request bodies, and response examples." },
  { icon: Bell, title: "Smart notifications", text: "Recurring reconciliation surfaces failing deployments, due tasks, and stale projects." },
  { icon: Activity, title: "Activity feed", text: "Every meaningful action is captured in a searchable timeline across all your projects." },
  { icon: Sparkles, title: "DevForge AI", text: "A data-driven workspace assistant that answers what to work on next, blockers, and summaries." },
];

const stacks = ["React", "Tailwind", "Express", "Prisma", "SQLite", "SSE"];

export function Landing() {
  const { user } = useAuth();
  useDocumentTitle("Your developer command center");

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-edge/70 bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo to="/" size="sm" />
          <nav className="flex items-center gap-1.5">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex h-8 items-center gap-2 rounded-md bg-accent-strong px-3.5 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent/90"
              >
                Open dashboard
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex h-8 items-center rounded-md px-3.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-2 hover:text-ink btn-focus"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex h-8 items-center rounded-md bg-accent-strong px-3.5 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent/90 btn-focus"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[520px] max-w-4xl bg-[radial-gradient(ellipse_at_top,rgba(214,178,60,0.16),transparent_62%)]"
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent">
                <Sparkles className="h-3 w-3" aria-hidden />
                Your developer command center
              </span>
              <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-[3.4rem]">
                Plan, ship, and monitor your work —{" "}
                <span className="bg-gradient-to-r from-accent via-[#f2d878] to-accent bg-clip-text text-transparent">
                  without the tool sprawl.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-ink-secondary">
                DevForge brings projects, tasks, repositories, deployments, API docs, and an AI
                workspace assistant into a single focused interface.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-accent-strong px-6 text-sm font-medium text-accent-contrast transition-all hover:bg-accent/90 hover:shadow-[0_10px_30px_-12px_rgba(214,178,60,0.55)] btn-focus"
                  >
                    Go to your workspace
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex h-11 items-center rounded-md bg-accent-strong px-6 text-sm font-medium text-accent-contrast transition-all hover:bg-accent/90 hover:shadow-[0_10px_30px_-12px_rgba(214,178,60,0.55)] btn-focus"
                    >
                      Create free account
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex h-11 items-center rounded-md border border-edge-strong px-6 text-sm font-medium text-ink transition-colors hover:border-accent/60 hover:bg-surface-2 btn-focus"
                    >
                      Try the demo
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] text-ink-muted">
                <Boxes className="h-3.5 w-3.5 text-accent/70" aria-hidden />
                {stacks.map((s) => (
                  <span key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-2xl border border-edge bg-surface-2/80 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-1.5 border-b border-edge px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-2 font-mono text-[10px] text-ink-muted">devforge — workspace session</span>
            </div>
            <div className="space-y-2 px-5 py-4 font-mono text-[12px] leading-relaxed">
              <p className="text-ink-muted">
                <span className="text-accent">&gt;</span> df projects <span className="text-ink-secondary">--open</span>
              </p>
              <p>
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-success align-middle" /> Forge API{" "}
                <span className="ml-1 text-ink-secondary">● live · 12/14 tasks</span>
              </p>
              <p>
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-warning align-middle" /> DevForge web{" "}
                <span className="ml-1 text-ink-secondary">▲ building · staging</span>
              </p>
              <p>
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-info align-middle" /> AI assistant{" "}
                <span className="ml-1 text-ink-secondary">◆ summarizing sprint</span>
              </p>
              <p className="text-ink-muted">
                <span className="text-accent">&gt;</span> df next{" "}
                <span className="text-ink-secondary">#42 resolve deploy-timeout on Forge API</span>
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Everything a focused team needs, <span className="text-accent">in one forge</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-secondary">
              Eight tightly integrated workspace modules that replace the usual juggling of tools.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="card p-5 transition-all duration-200 hover:border-accent/40 hover:shadow-[0_18px_50px_-28px_rgba(214,178,60,0.35)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                  <f.icon className="h-4 w-4" aria-hidden />
                </div>
                <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-secondary">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/15 via-surface-2 to-surface-2 px-6 py-14 text-center sm:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_0%,rgba(214,178,60,0.18),transparent_65%)]"
            />
            <div className="relative">
              <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                Start forging your next build
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-secondary">
                Free to get started. Plan projects, wire up deployments, and let the workspace keep every screen in sync.
              </p>
              <Link
                to={user ? "/dashboard" : "/register"}
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-md bg-accent-strong px-7 text-sm font-semibold text-accent-contrast transition-all hover:bg-accent hover:shadow-[0_14px_40px_-14px_rgba(214,178,60,0.6)] btn-focus"
              >
                {user ? "Open your workspace" : "Create free account"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
          <Logo size="sm" compact />
          <p className="text-center text-[11px] text-ink-muted">
            Simplifying software delivery, one screen at a time.
          </p>
          <div className="flex items-center gap-4 font-mono text-[11px] text-ink-muted">
            <Link to="/login" className="transition-colors hover:text-accent">
              Sign in
            </Link>
            <Link to="/register" className="transition-colors hover:text-accent">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}