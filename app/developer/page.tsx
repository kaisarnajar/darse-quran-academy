import { requireDeveloper } from "@/services/auth-actions";
import { startGatewayTest } from "./actions";

export default async function DeveloperDashboardPage() {
  await requireDeveloper();
  const activeProvider = process.env.PAYMENT_GATEWAY_PROVIDER || "STRIPE";

  return (
    <div className="max-w-4xl space-y-8">
      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Developer Dashboard</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-foreground">Gateway Testing Sandbox</h1>
        <p className="mt-2 text-sm text-muted">
          Use the utility below to verify connection and credentials of the configured payment gateway.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Connection status card */}
        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-foreground">Active Configuration</h2>
          <div className="mt-4 space-y-3">
            <div>
              <span className="text-xs text-muted block font-semibold">PROVIDER:</span>
              <span className="inline-flex mt-1 items-center rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary capitalize">
                {activeProvider}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted block font-semibold">TEST TARGET URL:</span>
              <span className="text-sm font-mono text-zinc-500 block truncate">
                {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
              </span>
            </div>
          </div>
        </div>

        {/* Integration session starter */}
        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">Launch Test Session</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Clicks will generate a test order for ₹10.00 using the active provider API keys and redirect your browser to their hosted sandbox checkout page.
            </p>
          </div>

          <form action={startGatewayTest} className="mt-6">
            <button
              type="submit"
              className="w-full btn-gold-solid inline-flex items-center justify-center py-3.5 text-sm font-semibold tracking-wide shadow-md cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Initialize Test Gateway Session
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
