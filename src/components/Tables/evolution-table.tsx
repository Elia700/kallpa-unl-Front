"use client";

import { useMemo, useState } from "react";
import { AssessmentTableData } from "@/types/assessment";
import { FiSearch } from "react-icons/fi";
import { SelectedParticipant } from "@/types/participant";
interface EvolutionTableProps {
  data: SelectedParticipant[];
  selectedParticipant: SelectedParticipant | null;
  onSelectParticipant: (participant: SelectedParticipant) => void;
}
export function EvolutionTable({
  data,
  selectedParticipant,
  onSelectParticipant,
}: EvolutionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesName = item.participant_name.toLowerCase().includes(term);
      const matchesDNI = item.dni ? item.dni.toString().includes(term) : false;

      return matchesName || matchesDNI;
    });
  }, [searchTerm, data]);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 rounded-xl border border-stroke bg-white p-2 transition-colors dark:border-slate-700 dark:bg-[#1a2233]">
        <div className="relative flex flex-grow items-center">
          <span className="absolute left-4 text-slate-400 dark:text-slate-500">
            <FiSearch size={20} />
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o DNI"
            className="w-full bg-transparent py-3 pl-12 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-stroke bg-white dark:border-slate-700 dark:bg-[#1a2233]">
        {filteredData.map((row) => {
          const isSelected =
            selectedParticipant?.participant_external_id ===
            row.participant_external_id;

          return (
            <div
              key={row.participant_external_id}
              onClick={() => onSelectParticipant(row)}
              className={`flex cursor-pointer items-center justify-between border-b border-stroke p-3 transition-all last:border-b-0 dark:border-slate-700/50 ${
                isSelected
                  ? "bg-blue-500/10 shadow-inner dark:bg-blue-500/20"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  {row.participant_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-tight text-slate-900 dark:text-white">
                    {row.participant_name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {row.dni}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {row.age} años
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
