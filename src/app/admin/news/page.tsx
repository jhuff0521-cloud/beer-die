import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsEditorForm } from "@/components/admin/NewsEditorForm";

export const metadata = { title: "Admin · News — Beer Die" };

export default function AdminNewsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/admin"
        className="mb-6 inline-block font-sans text-xs font-semibold uppercase tracking-widest2 text-ink-faint hover:text-accent"
      >
        ← Admin
      </Link>
      <SectionHeader title="Write News" className="mb-6" />
      <NewsEditorForm />
    </main>
  );
}
