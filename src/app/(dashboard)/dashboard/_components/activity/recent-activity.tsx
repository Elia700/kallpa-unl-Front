"use client"

import { useEffect, useState } from "react";
import { FiUser, FiBarChart2, FiCheckCircle } from "react-icons/fi";
import { RecentActivities } from "@/services/activity.service";

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const data = await RecentActivities.getRecent();
        
        // Si data es undefined, fue error de red, disparar evento SERVER_DOWN
        if (data === undefined) {
          window.dispatchEvent(new CustomEvent('SERVER_DOWN', { 
            detail: { message: "No se puede conectar con el servidor. Por favor intenta nuevamente más tarde." }
          }));
          setLoading(false);
          return;
        }
        
        setActivities(data);
      } catch (err) {
        console.error("Error al cargar actividades:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // No mostrar nada mientras carga, dejar que se renderice vacío
  if (loading) return null;

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm w-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Actividad Reciente
        </h3>
      </div>

      <div className="space-y-6">
        {activities.map((item) => {
          let IconComponent = FiUser;
          if (item.type === "MEDICION") IconComponent = FiCheckCircle;
          if (item.type === "PRUEBA") IconComponent = FiBarChart2;

          return (
            <div key={item.id} className="flex gap-4 w-full">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 shadow-sm">
                <IconComponent size={22} className="text-blue-600 dark:text-blue-400" />
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-start justify-between w-full">
                  <span className="font-bold text-gray-900 dark:text-white text-base">
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-1">
                  <span
                    className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider 
                               bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-current border-opacity-10"
                  >
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}