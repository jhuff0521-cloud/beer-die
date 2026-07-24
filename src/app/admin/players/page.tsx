import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Avatar } from "@/components/ui/Avatar";
import { PlayerEditorForm } from "@/components/admin/PlayerEditorForm";
import { getPlayers } from "@/lib/api";

export const metadata = { title: "Admin · Players — Beer Die" };
export const dynamic = "force-dynamic";

export default async function AdminPlayersPage() {
  const players = await getPlayers();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/admin"
        className="mb-6 inline-block font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint hover:text-accent"
      >
        ← Admin
      </Link>
      <SectionHeader title="Players" subtitle="Add or edit" className="mb-6" />

      <PlayerEditorForm />

      <div className="mt-10">
        <SectionHeader title="Current Roster" subtitle={`${players.length}`} className="mb-4" />
        <div className="divide-y divide-bg-border border border-bg-border">
          {players.map((p) => (
            <div key={p.name} className="flex items-center gap-3 px-4 py-3">
              <Avatar src={p.photo} alt={p.name} size="sm" />
              <span className="font-sans text-sm text-ink">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
