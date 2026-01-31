import React from 'react';
import { useSession } from '@/context/SessionContext';
import { RefreshCcw } from 'lucide-react';

export const ServerDown: React.FC = () => {
  const { serverDown, serverMessage, clearServerDown } = useSession();

  const handleRetry = () => {
    clearServerDown();
  };


  if (!serverDown) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
            <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mantenimiento</h3>
        </div>

        <p className="mb-6 text-gray-600 dark:text-gray-300">{serverMessage || 'No se puede conectar con el servidor. Por favor intenta nuevamente más tarde.'}</p>

        <div className="flex gap-3">
          <button onClick={handleRetry} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition-all hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/20">
            <div className="flex items-center justify-center gap-2">
              <RefreshCcw size={18} />
              Reintentar
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
