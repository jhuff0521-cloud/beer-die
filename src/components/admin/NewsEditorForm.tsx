"use client";

import { useState } from "react";
import { clsx } from "@/lib/clsx";

export function NewsEditorForm() {
  const [headline, setHeadline] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, excerpt, body }),
      });
      const data = await res.json();
      setStatus({ ok: data.success, message: data.message });
      if (data.success) {
        setHeadline("");
        setExcerpt("");
        setBody("");
      }
    } catch {
      setStatus({ ok: false, message: "Request failed." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 border border-bg-border bg-bg-surface p-5">
      <div>
        <label className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
          Headline
        </label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          required
          className="w-full border border-bg-border bg-bg px-3 py-2 font-sans text-sm text-ink outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
          Excerpt
        </label>
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full border border-bg-border bg-bg px-3 py-2 font-sans text-sm text-ink outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-widest2 text-ink-faint">
          Body
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
          className="w-full border border-bg-border bg-bg px-3 py-2 font-sans text-sm text-ink outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="self-start border border-accent bg-accent px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest2 text-white hover:bg-accent-dim disabled:opacity-50"
      >
        {submitting ? "Publishing…" : "Publish Article"}
      </button>
      {status && (
        <p className={clsx("font-sans text-xs", status.ok ? "text-ink" : "text-accent")}>{status.message}</p>
      )}
    </form>
  );
}
