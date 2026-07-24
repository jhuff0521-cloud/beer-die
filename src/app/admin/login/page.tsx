export const metadata = { title: "Admin Login — Beer Die" };

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { from?: string; error?: string };
}) {
  const from = searchParams.from ?? "/admin";
  const hasError = searchParams.error === "1";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <div className="mb-6 flex items-center justify-center gap-2 font-display text-2xl font-bold uppercase tracking-tight">
        <span className="text-accent">⬥</span> Beer Die
      </div>
      <form
        method="POST"
        action="/api/admin/login"
        className="flex flex-col gap-4 border border-bg-border bg-bg-surface p-6"
      >
        <input type="hidden" name="from" value={from} />
        <div>
          <label className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
            Admin Password
          </label>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="w-full border border-bg-border bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        {hasError && (
          <p className="font-sans text-xs font-semibold text-accent">Incorrect password. Try again.</p>
        )}
        <button
          type="submit"
          className="border border-accent bg-accent px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest2 text-white hover:bg-accent-dim"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
