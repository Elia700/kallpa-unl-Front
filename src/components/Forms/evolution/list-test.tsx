"use client";

import Loader from "@/components/Loader/loader";
import { deleteTest, getTests } from "@/hooks/api";
import { Check, Edit, Slash, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const StatusSwitch = ({ isOn, onToggle, disabled }: { isOn: boolean; onToggle: () => void; disabled?: boolean }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      disabled={disabled}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none ${isOn ? "bg-green-500" : "bg-gray-300 dark:bg-dark-4"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${isOn ? "translate-x-5.5" : "translate-x-1"
          }`}
      />
    </button>
  );
};

export function ListTest() {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getTests();
        setEvaluations(data ?? []);
      } catch (error) {
        console.error("Error al cargar evaluaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleToggleStatus = async (externalId: string, currentStatus: string) => {
    setUpdatingId(externalId);
    try {
      await deleteTest(externalId);
      setEvaluations((prev) =>
        prev.map((item) =>
          item.external_id === externalId
            ? { ...item, status: currentStatus === "Activo" ? "Inactivo" : "Activo" }
            : item
        )
      );
    } catch (error: any) {
      console.error("Error al actualizar estado:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loader size={60} color="text-blue-500" className="py-20" />;
  }

  return (
    <div className="overflow-hidden rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card transition-colors duration-300">
      <div className="mb-6 flex items-start gap-4 rounded-lg border-l-4 border-primary bg-primary/5 p-4 dark:bg-primary/10">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
          i
        </div>
        <div>
          <h4 className="text-sm font-bold text-dark dark:text-white">Información importante</h4>
          <p className="mt-1 text-xs leading-relaxed text-body-color dark:text-gray-400">
            Las evaluaciones que ya han sido **aplicadas a los participantes** no pueden ser editadas ni desactivadas para garantizar la integridad del historial de resultados.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {evaluations.map((evalu) => (
          <div
            key={evalu.external_id}
            className="relative rounded-xl border border-stroke p-4 transition-all duration-300 hover:shadow-2 dark:border-dark-3 hover:border-primary dark:hover:border-primary bg-white dark:bg-dark-2 flex flex-col justify-between"
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${evalu.status === 'Activo'
                  ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                  : 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
                  }`}>
                  {evalu.status.toUpperCase()}
                </span>
                {!evalu.already_done && (
                  <StatusSwitch
                    isOn={evalu.status === "Activo"}
                    onToggle={() => handleToggleStatus(evalu.external_id, evalu.status)}
                    disabled={updatingId === evalu.external_id}
                  />
                )}
              </div>

              <h3 className="mb-1 font-bold text-dark dark:text-white capitalize text-base leading-tight">
                {evalu.name}
              </h3>

              <div className="space-y-1 mb-3 text-body-color dark:text-body-color-dark">
                <p className="text-[11px] flex items-center gap-1.5">
                  <span className="opacity-70">📅</span> Cada {evalu.frequency_months} mes(es)
                </p>
                <p className="text-[11px] flex items-center gap-1.5">
                  <span className="opacity-70">🏋️</span> {evalu.exercises.length} ejercicios
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-stroke dark:border-dark-3">
                {evalu.exercises.slice(0, 2).map((ex: any) => (
                  <span
                    key={ex.external_id}
                    className="text-[9px] bg-gray-2 dark:bg-dark-3 px-2 py-0.5 rounded-md text-body-color dark:text-gray-400 font-medium"
                  >
                    {ex.name}
                  </span>
                ))}
                {evalu.exercises.length > 2 && (
                  <span className="text-[9px] text-body-color font-bold self-center">
                    +{evalu.exercises.length - 2}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 h-8">
              {!evalu.already_done && evalu.status === "Activo" && (
                <button
                  onClick={() => router.push(`/evolution/edit-test/${evalu.external_id}`)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200"
                  title="Editar"
                >
                  <Edit size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        <Link
          href="/evolution/form-test"
          className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-stroke p-4 transition-all duration-300 hover:bg-gray-2 hover:border-primary dark:border-dark-3 dark:hover:bg-dark-3 group"
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xl group-hover:scale-110 transition-transform">
            +
          </div>
          <span className="font-bold text-dark dark:text-white text-sm">Nueva Evaluación</span>
          <span className="text-[10px] text-body-color text-center mt-0.5">Crea un nuevo protocolo</span>
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-stroke pt-4 dark:border-dark-3">
        <p className="text-xs text-body-color">
          Mostrando <span className="font-bold text-dark dark:text-white">{evaluations.length}</span> evaluaciones
        </p>
      </div>
    </div>
  );
}