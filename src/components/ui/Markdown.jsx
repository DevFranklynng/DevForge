import { Fragment } from "react";
import { cn } from "@/lib/cn";

function inlineCode(text) {
  return text.split(/`([^`]+)`/g).map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="rounded bg-surface-3 px-1 py-px font-mono text-[0.85em] text-accent">
        {part}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function renderBoldLink(text, key) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        return (
          <a key={`${key}-${i}`} href={match[2]} className="text-accent hover:text-accent-strong hover:underline">
            {match[1]}
          </a>
        );
      }
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${key}-${i}`} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={`${key}-${i}`}>{inlineCode(part)}</Fragment>;
  });
}

function renderLine(line, index) {
  if (/^###\s/.test(line)) {
    return <h3 key={index} className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-secondary first:mt-0">{line.slice(4)}</h3>;
  }
  if (/^##\s/.test(line)) {
    return <h2 key={index} className="mt-4 text-sm font-semibold text-ink first:mt-0">{line.slice(3)}</h2>;
  }
  if (/^#\s/.test(line)) {
    return <h2 key={index} className="mt-4 text-base font-semibold text-ink first:mt-0">{line.slice(2)}</h2>;
  }
  if (/^-\s/.test(line)) {
    return (
      <li key={index} className="mt-1 list-disc marker:text-ink-muted text-[13px] leading-relaxed text-ink-secondary">
        {renderBoldLink(line.slice(2), index)}
      </li>
    );
  }
  if (/^\d+\.\s/.test(line)) {
    return (
      <p key={index} className="mt-1 text-[13px] leading-relaxed text-ink-secondary">
        {renderBoldLink(line, index)}
      </p>
    );
  }
  if (/^```/.test(line)) {
    return <pre key={index} className="rounded-md bg-surface-3 px-3 py-2 font-mono text-xs text-accent" />;
  }
  if (line.trim() === "") return <div key={index} className="h-2" />;
  return (
    <p key={index} className="text-[13px] leading-relaxed text-ink-secondary">
      {renderBoldLink(line, index)}
    </p>
  );
}

export function Markdown({ content, className }) {
  const lines = String(content || "").split("\n");
  const nodes = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      const parts = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        parts.push(lines[i]);
        i += 1;
      }
      i += 1;
      nodes.push(
        <pre key={`code-${nodes.length}`} className="overflow-x-auto rounded-md bg-surface-3 px-3 py-2 font-mono text-[12px] leading-relaxed text-ink">
          {parts.join("\n")}
        </pre>,
      );
      continue;
    }
    if (/^-\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^-\s/.test(lines[i])) {
        items.push(lines[i]);
        i += 1;
      }
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="pl-4">
          {items.map((l, idx) => renderLine(l, idx))}
        </ul>,
      );
      continue;
    }
    nodes.push(renderLine(line, i));
    i += 1;
  }

  return <div className={cn("space-y-0.5 text-sm", className)}>{nodes}</div>;
}