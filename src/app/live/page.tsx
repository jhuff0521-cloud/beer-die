import { LiveView } from "@/components/LiveView";
import { getLiveGame } from "@/lib/api";

export const metadata = { title: "Live — Beer Die" };
export const dynamic = "force-dynamic";

export default async function LivePage() {
  const initial = await getLiveGame();
  return <LiveView initial={initial} />;
}
