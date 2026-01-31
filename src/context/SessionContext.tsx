import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface SessionContextType {
  sessionError: string | null;
  showSessionError: (message: string) => void;
  clearSessionError: () => void;
  serverDown: boolean;
  serverMessage: string | null;
  showServerDown: (message: string) => void;
  clearServerDown: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [serverDown, setServerDown] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const showSessionError = useCallback((message: string) => {
    setSessionError(message);
  }, []);

  const clearSessionError = useCallback(() => {
    setSessionError(null);
  }, []);

  const showServerDown = useCallback((message: string) => {
    setServerMessage(message);
    setServerDown(true);
  }, []);

  const clearServerDown = useCallback(() => {
    setServerDown(false);
    setServerMessage(null);
  }, []);

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      showSessionError(customEvent.detail.message);
    };

    const handleServerDown = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      showServerDown(customEvent.detail.message);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const isAxiosNetworkError = reason && reason.isAxiosError && !reason.response;
      const isNetworkMessage = reason && typeof reason.message === 'string' && reason.message.includes('Network Error');
      const isHandledGlobally = reason && reason.handledGlobally === true;

      if (isAxiosNetworkError || isNetworkMessage || isHandledGlobally) {
        // Prevenir que el navegador/Next.js muestren el overlay de error
        event.preventDefault();
        console.log('Network error handled by global handler');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('SESSION_EXPIRED', handleSessionExpired);
      window.addEventListener('SERVER_DOWN', handleServerDown);
      window.addEventListener('unhandledrejection', handleUnhandledRejection as EventListener);
      return () => {
        window.removeEventListener('SESSION_EXPIRED', handleSessionExpired);
        window.removeEventListener('SERVER_DOWN', handleServerDown);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection as EventListener);
      };
    }
  }, [showSessionError, showServerDown]);

  return (
    <SessionContext.Provider value={{ sessionError, showSessionError, clearSessionError, serverDown, serverMessage, showServerDown, clearServerDown }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe ser utilizado dentro de SessionProvider');
  }
  return context;
};
