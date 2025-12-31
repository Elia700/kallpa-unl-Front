"use client";

import { Column } from "@/components/Tables/tablebase";
import { Participant } from "@/types/participant";
import { cn } from "@/lib/utils";
import { DownloadIcon, PreviewIcon } from "../icons";

export const historyColumns = (
  navigate: (path: string) => void,
): Column<Participant>[] => [
  {
    header: "Participante",
    accessor: (p) => {
      const name = `${p.firstName} ${p.lastName ?? ""}`.trim();
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold text-primary">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight text-dark dark:text-white">
              {name || "Sin nombre"}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    header: "Edad",
    accessor: (p) => p.age ?? "-",
    className: "font-medium text-dark dark:text-white",
  },

  {
    header: "DNI / Documento",
    accessor: (p) => p.dni ?? "-",
    className: "font-medium text-dark dark:text-white",
  },

  {
    header: "Estado",
    accessor: (p) => (
      <span
        className={cn(
          "rounded border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
          {
            "border-green-500/20 bg-green-500/10 text-green-500":
              p.status === "ACTIVO",
            "border-red-500/20 bg-red-500/10 text-red-500":
              p.status === "INACTIVO",
          },
        )}
      >
        {p.status ?? "—"}
      </span>
    ),
  },

  {
    header: "Acciones",
    headerClassName: "text-right",
    accessor: (p) => (
      <div className="flex items-center justify-end gap-x-4 text-gray-400">
        <button
          className="transition-colors hover:text-dark dark:hover:text-white"
          onClick={() =>
            navigate(`/history/measurements/${p.external_id}`)
          }
        >
          <PreviewIcon />
        </button>

        <button
          className="transition-colors hover:text-dark dark:hover:text-white"
          onClick={() => console.log("Descargar", p.external_id)}
        >
          <DownloadIcon />
        </button>
      </div>
    ),
  },
];
