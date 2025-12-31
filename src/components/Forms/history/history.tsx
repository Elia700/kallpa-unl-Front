import DatePickerTwo from "@/components/FormElements/DatePicker/DatePickerTwo";
import { getTestHistory, getTestsForParticipant } from "@/hooks/api";
import { TestHistoryData, TestListItemForParticipant } from "@/types/test";
import React, { useEffect, useState } from "react";
import {
  FiTrendingUp,
  FiActivity,
  FiMinus,
  FiTrendingDown,
  FiClipboard,
  FiShuffle,
} from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
interface PerformanceDashboardProps {
  participantId: string;
}
export default function PerformanceDashboard({
  participantId,
}: PerformanceDashboardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [tests, setTests] = useState<TestListItemForParticipant[]>([]);
  const [selectedTest, setSelectedTest] =
    useState<TestListItemForParticipant | null>(null);
  const [testHistory, setTestHistory] = useState<TestHistoryData | null>(null);
  const [hasFiltered, setHasFiltered] = useState(false);
  const [baseExercises, setBaseExercises] = useState<
    TestHistoryData["exercises"] | null
  >(null);
  const handleSelectTest = (test: TestListItemForParticipant) => {
    setSelectedTest(test);
    setHasFiltered(false);
    setStartDate(undefined);
    setEndDate(undefined);
    setTestHistory(null);

    const emptyExercises = test.exercises.reduce((acc: any, ex: any) => {
      acc[ex.external_id] = {
        exercise_name: ex.name,
        stats: {
          average: 0,
          delta: 0,
        },
        trend: {
          status: "estable",
        },
        timeline: [],
      };
      return acc;
    }, {});

    setBaseExercises(emptyExercises);
  };
  const handleFilter = (start?: string, end?: string) => {
    if (!selectedTest || !selectedTest.already_done) return;

    setHasFiltered(true);

    getTestHistory(participantId, selectedTest.external_id, 0, start, end)
      .then((res) => setTestHistory(res.data))
      .catch((err) => console.error(err));
  };
  const exercisesToRender =
    hasFiltered && testHistory ? testHistory.exercises : baseExercises;
  useEffect(() => {
    if (participantId) {
      getTestsForParticipant(participantId)
        .then((fetchedTests) => {
          setTests(fetchedTests);
          if (fetchedTests.length > 0) {
            handleSelectTest(fetchedTests[0]);
          }
        })
        .catch((err) => console.error("Error al cargar tests:", err));
    }
  }, [participantId]);
  return (
    <div className="mt-8">
      <div className="h-px w-full bg-gray-300 shadow-sm dark:bg-gray-600"></div>
      <div className="mb-6 mt-10">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Progreso de Tests Físicos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Análisis de rendimiento en el periodo seleccionado
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row">
        <div className="mt-5 w-full space-y-6 md:w-1/3">
          <div>
            <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Seleccionar Test
            </h3>
            <div className="space-y-2">
              {tests.map((test) => {
                const isSelected =
                  selectedTest?.external_id === test.external_id;
                return (
                  <div
                    key={test.external_id}
                    onClick={() => handleSelectTest(test)}
                    className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500/50 bg-blue-500/5 shadow-md"
                        : "border-transparent bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isSelected
                          ? "text-blue-500"
                          : "text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white"
                      }`}
                    >
                      {test.name}
                    </span>

                    {/* Icono de Check estilo imagen de referencia */}
                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full space-y-6 md:w-2/3">
          {selectedTest && (
            <>
              <div className="mb-2 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#1a2233]">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="min-w-[200px] flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedTest.name}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Comparativa de rendimiento de los ejercicios
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="w-full sm:w-[180px]">
                      <DatePickerTwo
                        label="Fecha Inicio"
                        value={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          handleFilter(date, endDate);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="relative z-10 w-[180px]">
                        <DatePickerTwo
                          label="Fecha Fin"
                          value={endDate}
                          onChange={(date) => {
                            setEndDate(date);
                            handleFilter(startDate, date);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {exercisesToRender && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.values(exercisesToRender).map((exercise) => (
                    <StatCard
                      key={exercise.exercise_name}
                      label={exercise.exercise_name}
                      value={exercise.stats.average?.toString() || "0"}
                      delta={exercise.stats.delta || 0}
                      status={exercise.trend.status}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="mt-4 flex items-center gap-2 text-xs font-medium text-blue-500 hover:underline"
              >
                {showHistory
                  ? "Ocultar historial detallado"
                  : "Ver historial detallado de los test"}
                <svg
                  className={`h-3 w-3 transition-transform duration-300 ${
                    showHistory ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  showHistory
                    ? "mt-4 max-h-[1500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-[#1a2233]">
                    <Table className="min-w-[600px]">
                      <TableHeader>
                        <TableRow className="bg-slate-100 dark:bg-[#1e293b]">
                          <TableHead className="text-slate-700 dark:text-slate-400">
                            Fecha
                          </TableHead>
                          <TableHead className="text-slate-700 dark:text-slate-400">
                            Resultado
                          </TableHead>
                          <TableHead className="text-slate-700 dark:text-slate-400">
                            Comparativa
                          </TableHead>
                          <TableHead className="text-slate-700 dark:text-slate-400">
                            Tendencia
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-slate-200 text-slate-900 dark:divide-slate-700 dark:text-white">
                        {testHistory &&
                          Object.values(testHistory.exercises).map((exercise) =>
                            exercise.timeline.map((entry, index) => {
                              const prevValue =
                                index > 0
                                  ? exercise.timeline[index - 1].value
                                  : null;
                              const delta =
                                prevValue !== null
                                  ? entry.value - prevValue
                                  : 0;

                              return (
                                <TableRow
                                  key={`${exercise.exercise_name}-${entry.date}`}
                                  className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                >
                                  <TableCell>{entry.date}</TableCell>
                                  <TableCell className="font-bold">
                                    {entry.value} {exercise.unit}
                                  </TableCell>
                                  <TableCell
                                    className={`${
                                      delta > 0
                                        ? "text-green-500"
                                        : delta < 0
                                          ? "text-red-500"
                                          : "text-slate-400 dark:text-slate-400"
                                    }`}
                                  >
                                    {delta > 0
                                      ? `+${delta}`
                                      : delta < 0
                                        ? `${delta}`
                                        : "-"}
                                  </TableCell>
                                  <TableCell>{exercise.trend.status}</TableCell>
                                </TableRow>
                              );
                            }),
                          )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, status, unit }: any) {
  const getStatusConfig = (statusText: string) => {
    switch (statusText.toLowerCase()) {
      case "mejorando":
        return {
          textColor: "text-green-500",
          barColor: "bg-green-500",
          mainIcon: <FiTrendingUp className="text-green-500" size={18} />,
          indicator: "↑",
        };
      case "bajando":
        return {
          textColor: "text-red-500",
          barColor: "bg-red-500",
          mainIcon: <FiTrendingDown className="text-red-500" size={18} />,
          indicator: "↓",
        };
      case "inestable":
        return {
          textColor: "text-amber-500",
          barColor: "bg-amber-500",
          mainIcon: <FiShuffle className="text-amber-500" size={18} />,
          indicator: "↔",
        };
      case "estable":
        return {
          textColor: "text-yellow-400",
          barColor: "bg-yellow-400",
          mainIcon: <FiMinus className="text-yellow-400" size={18} />,
          indicator: "→",
        };
      default:
        return {
          textColor: "text-gray-500",
          barColor: "bg-gray-500",
          mainIcon: <FiActivity className="text-gray-500" size={18} />,
          indicator: "→",
        };
    }
  };

  const config = getStatusConfig(status);
  const numericValue = parseFloat(value) || 0;
  const percentage = Math.min(Math.max((numericValue / 100) * 100, 5), 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#1a2233]">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-slate-200/50 p-1.5 dark:bg-slate-700/50">
          {config.mainIcon}
        </div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </span>
      </div>

      <div className="mb-2">
        <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
          {value}
          <span className="ml-1 text-sm font-normal text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        </h3>
      </div>

      <div className="flex items-center gap-1.5 text-sm font-medium">
        <span className={`${config.textColor} flex items-center gap-0.5`}>
          {config.indicator} {Math.abs(delta || 0)}
        </span>
        <span className="text-slate-400 dark:text-slate-500">•</span>
        <span className={config.textColor}>{status}</span>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full ${config.barColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
