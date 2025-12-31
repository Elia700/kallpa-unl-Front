"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { MeasurementsForm } from "@/components/Forms/measurements-form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAssessmentsByParticipant } from "@/hooks/api";
import Loader from "@/components/Loader/loader";
// export const metadata: Metadata = {
//   title: "Anthropometric Measurements Page",
// };

export default function MeasurementPage() {
  const params = useParams<{ participantId: string }>();
  const participantId = params?.participantId;

  const [participant, setParticipant] = useState<any | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!participantId) return;
    const load = async () => {
      try {
        const res = await getAssessmentsByParticipant(participantId);
        setParticipant(res.participant);
        setAssessments(res.assessments);
      } catch (err) {
        console.error("Error al cargar datos", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [participantId]);

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader size={60} color="text-primary" />
      </div>
    );
  }
  if (!participant) {
    return (
      <div className="mx-auto max-w-[1080px] p-10 text-center">
        <h2 className="text-xl font-bold dark:text-white">
          Participante no encontrado
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] p-4">
      <Breadcrumb pageName="Historial - Participante" />

      <div className="rounded-2xl bg-white shadow-sm dark:bg-[#1a222c]">
          <div className="p-6">
            <MeasurementsForm
              participant={participant}
              measurements={assessments}
            />
          </div>
      </div>
    </div>
  );
}
