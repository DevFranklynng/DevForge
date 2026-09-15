import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export function fromNow(date) {
  if (!date) return "—";
  return dayjs(date).fromNow();
}

export function formatDate(date) {
  if (!date) return "—";
  return dayjs(date).format("MMM D, YYYY");
}

export function todayString() {
  return dayjs().format("dddd, MMMM D");
}

export function formatDateTime(date) {
  if (!date) return "—";
  return dayjs(date).format("MMM D, YYYY · HH:mm");
}

export function isOverdue(date) {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs().startOf("day"));
}

export function dayLabel(value) {
  const d = dayjs(value);
  const today = dayjs().startOf("day");
  if (d.isSame(today, "day")) return "Today";
  if (d.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
  return d.format("MMM D, YYYY");
}

export function greetingForHour(hour = new Date().getHours()) {
  if (hour < 5) return "Working late";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function initials(name, max = 2) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]);
  return parts.slice(0, max).join("").toUpperCase();
}

export function durationLabel(ms) {
  if (!ms) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

export function shortHash(commit) {
  if (!commit) return "—";
  return commit.length > 8 ? commit.slice(0, 8) : commit;
}

export function titleCase(value) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}