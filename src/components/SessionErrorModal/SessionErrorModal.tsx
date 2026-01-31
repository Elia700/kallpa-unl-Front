import React from 'react';
import { useSession } from '@/context/SessionContext';
import { Hourglass, ShieldCheck, LogIn } from 'lucide-react';

export const SessionErrorModal: React.FC = () => {
  const { sessionError, clearSessionError } = useSession();

  const handleRedirect = () => {
    clearSessionError();
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  if (!sessionError) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white dark:bg-[#12141c] border border-gray-200 dark:border-gray-800 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/10">
              <Hourglass className="h-10 w-10 text-indigo-600 dark:text-indigo-500" />
              <div className="absolute h-1 w-12 bg-indigo-600 dark:bg-indigo-500 rotate-45 rounded-full shadow-lg"></div>
            </div>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Sesión Expirada
          </h3>
          <p className="mb-8 text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-4">
            {sessionError}
          </p>
          <div className="w-full">
            <button
              onClick={handleRedirect}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition-all hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <LogIn size={20} />
              Iniciar Sesión
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