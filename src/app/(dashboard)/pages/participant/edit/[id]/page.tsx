"use client";
import { EditParticipantForm } from "@/components/Forms/edit-participant-form";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { use } from "react";

interface EditParticipantPageProps {
  params: Promise<{ id: string }>;
}

export default function EditParticipantPage({ params }: EditParticipantPageProps) {
  const { id } = use(params);

  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Editar Participante" />
      <EditParticipantForm participantId={id} />
    </div>
  );
}
