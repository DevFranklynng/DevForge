import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Sparkles, Send, RotateCcw, Hammer, Cpu } from "lucide-react";
import { aiApi, projectsApi } from "@/services/api";
import { useAuth } from "@/features/auth/auth-context";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Markdown } from "@/components/ui/Markdown";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { titleCase } from "@/utils/format";

const starterSuggestions = [
  "What should I work on next?",
  "Summarize my development activity.",
  "Which projects need attention?",
  "Are there any potential blockers?",
];

const severityTone = {
  low: "success",
  medium: "warning",
  high: "danger",
};

export function Ai() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const navigate = useNavigate();

  const projectsQuery = useQuery({
    queryKey: ["projects", {}],
    queryFn: () => projectsApi.list(),
  });

  const askMutation = useMutation({
    mutationFn: ({ message, projectId }) => aiApi.ask(message, projectId || null),
    onSuccess: (res) => {
      setMessages((prev) => [...prev, { role: "assistant", ...res.response }]);
    },
    onError: (err) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", error: true, content: err.message || "The workspace assistant had a problem." },
      ]);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, askMutation.isPending]);

  const submit = (text) => {
    const message = (text || input).trim();
    if (!message || askMutation.isPending) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    askMutation.mutate({ message, projectId });
  };

  const reset = () => {
    setMessages([]);
    askMutation.reset();
  };

  const isBusy = askMutation.isPending;
  const projects = projectsQuery.data?.projects ?? [];

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-accent/30 bg-accent/10">
            <Sparkles className="h-4 w-4 text-accent" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">DevForge AI</h1>
            <p className="text-[11px] text-ink-muted">Workspace assistant · reads your real data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={projectId} onChange={(e) => setProjectId(e.target.value)} aria-label="Scope AI to a project" className="w-44">
            <option value="">Whole workspace</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
          <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />} onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-6 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10">
              <Hammer className="h-7 w-7 text-accent" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold">Ask anything about {user?.name?.split(" ")[0] || "your"} workspace</p>
              <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-ink-muted">
                The assistant answers from your live projects, tasks, deployments and activity. It
                can reason about schedules, risks and what to do next.
              </p>
            </div>
            <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
              {starterSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-lg border border-edge bg-surface-2 px-3 py-2.5 text-left text-xs text-ink-secondary transition-colors hover:border-accent/50 hover:text-ink btn-focus"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" ? (
              <Card className="max-w-[85%] p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-accent">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden /> DevForge AI
                  </span>
                  {m.isDemo && <Badge tone="accent">Demo mode</Badge>}
                  {m.severity && m.severity !== "low" && (
                    <Badge tone={severityTone[m.severity] || "neutral"}>{titleCase(m.severity)}</Badge>
                  )}
                  {typeof m.confidence === "number" && (
                    <span className="font-mono text-[10px] text-ink-muted">confidence {Math.round(m.confidence * 100)}%</span>
                  )}
                  {m.providerUsed && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-muted">
                      <Cpu className="h-3 w-3" aria-hidden /> {m.providerUsed}
                    </span>
                  )}
                </div>

                <Markdown content={m.error ? `> ${m.content}` : m.content} />

                {m.actions?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-edge pt-3">
                    {m.actions.map((a) => (
                      <button
                        key={a.label}
                        onClick={() => navigate(a.href)}
                        className="rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-[11px] font-medium text-accent transition-colors hover:bg-accent/20 btn-focus"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            ) : (
              <div className="max-w-[85%] rounded-lg border border-edge bg-surface-2 px-4 py-2.5">
                <p className="text-sm text-ink">{m.content}</p>
              </div>
            )}
          </div>
        ))}

        {isBusy && (
          <div className="flex justify-start">
            <Card className="flex items-center gap-2 px-4 py-3">
              <span className="h-3 w-3 animate-pulse rounded-full bg-accent" />
              <p className="text-xs text-ink-muted">Thinking about your workspace…</p>
            </Card>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="shrink-0 border-t border-edge pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={`Ask about tasks, priorities, blockers… ${projectId ? "(scoped to selected project)" : ""}`}
            className="min-h-[44px] max-h-32 resize-y"
            aria-label="Message for DevForge AI"
          />
          <Button type="submit" variant="primary" loading={isBusy} disabled={!input.trim() || isBusy} aria-label="Send message">
            <Send className="h-4 w-4" aria-hidden />
          </Button>
        </form>
        <p className="mt-1.5 text-center text-[10px] text-ink-muted">
          Try: “What should I work on next?” · “Summarize my week” · “Any blockers?” · “Deployment status”
        </p>
      </div>
    </div>
  );
}