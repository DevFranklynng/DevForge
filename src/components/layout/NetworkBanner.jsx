import { WifiOff } from "lucide-react";
import { useOnline } from "@/hooks/useOnline";

/** Slim warning strip shown while the browser reports being offline. */
export function NetworkBanner() {
  const online = useOnline();

  if (online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 border-b border-warning/25 bg-warning-soft px-4 py-1.5 text-xs font-medium text-warning"
    >
      <WifiOff className="h-3.5 w-3.5" aria-hidden />
      You’re offline — showing cached data. Reconnecting…
    </div>
  );
}