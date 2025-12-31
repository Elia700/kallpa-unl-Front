import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { getParticipants } from "@/hooks/api";
import { HistoryTable } from "@/components/Tables/history-table";

export const metadata: Metadata = {
  title: "Anthropometric Measurements Page",
};

export default async function HistoryPage() {
  const participants = await getParticipants();
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Historial - Participantes" />
      <div className="space-y-10">
        <HistoryTable data={participants} />
      </div>
    </div>
  );
}
