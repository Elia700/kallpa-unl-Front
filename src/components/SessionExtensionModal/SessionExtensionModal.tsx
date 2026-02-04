"use client";

import React from "react";
import { Clock, ShieldCheck, LogIn, RefreshCw } from "lucide-react";

interface SessionExtensionModalProps {
  onExtend: () => void;
  onLogout: () => void;
  isExtending?: boolean;
}

export const SessionExtensionModal: React.FC<SessionExtensionModalProps> = ({
  onExtend,
  onLogout,
  isExtending = false,
}) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 dark:bg-black/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white dark:bg-[#12141c] border border-gray-200 dark:border-gray-800 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10">
              <Clock className="h-10 w-10 text-amber-600 dark:text-amber-500" />
            </div>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Tu sesión expirará pronto
          </h3>
          <p className="mb-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-4">
            ¿Deseas continuar? Haz clic en &quot;Extender&quot; para mantener tu sesión activa.
          </p>
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={onExtend}
              disabled={isExtending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition-all hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExtending ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Extendiendo...
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  Extender
                </>
              )}
            </button>
            <button
              onClick={onLogout}
              disabled={isExtending}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <LogIn size={20} />
              Cerrar sesión
            </button>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-[#0d0f14] py-3 flex items-center justify-center gap-2 border-t border-gray-100 dark:border-gray-800/50">
          <ShieldCheck size={14} className="text-gray-400 dark:text-gray-600" />
          <span className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-600 font-medium">
            Protección de datos activa • Kallpa UNL
          </span>
        </div>
      </div>
    </div>
  );
};
