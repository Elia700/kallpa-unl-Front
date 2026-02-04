"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { authService } from "@/services/auth.service";
import { SessionExtensionModal } from "@/components/SessionExtensionModal/SessionExtensionModal";

const INACTIVITY_WARNING_MS = 3 * 60 * 1000;
const INACTIVITY_EXPIRE_MS = 4 * 60 * 1000;

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
] as const;

interface InactivityContextType {
  showExtensionModal: boolean;
  extendSession: () => Promise<void>;
  logout: () => void;
}

const InactivityContext = createContext<InactivityContextType | undefined>(undefined);

function useIsAuthenticated(): boolean {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setHasToken(!!localStorage.getItem("token"));
    check();
    // Revisar al hacer login/logout (storage event o polling simple)
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  return hasToken;
}

export const InactivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expireTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showModalRef = useRef(false);
  const hasToken = useIsAuthenticated();

  showModalRef.current = showExtensionModal;

  const logout = useCallback(() => {
    warningTimerRef.current && clearTimeout(warningTimerRef.current);
    expireTimerRef.current && clearTimeout(expireTimerRef.current);
    warningTimerRef.current = null;
    expireTimerRef.current = null;
    setShowExtensionModal(false);
    authService.logout();
  }, []);

  const resetTimers = useCallback(() => {
    setShowExtensionModal(false);

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (expireTimerRef.current) {
      clearTimeout(expireTimerRef.current);
      expireTimerRef.current = null;
    }

    warningTimerRef.current = setTimeout(() => {
      warningTimerRef.current = null;
      setShowExtensionModal(true);

      expireTimerRef.current = setTimeout(() => {
        expireTimerRef.current = null;
        logout();
      }, INACTIVITY_EXPIRE_MS - INACTIVITY_WARNING_MS);
    }, INACTIVITY_WARNING_MS);
  }, [logout]);

  const extendSession = useCallback(async () => {
    setIsExtending(true);
    try {
      await authService.refreshToken();
      resetTimers();
    } catch {
      logout();
    } finally {
      setIsExtending(false);
    }
  }, [resetTimers, logout]);

  useEffect(() => {
    if (!hasToken || typeof window === "undefined") return;

    const handleActivity = () => {
      if (showModalRef.current) return; // No resetear si ya mostramos el modal
      resetTimers();
    };

    resetTimers();

    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, handleActivity));

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, handleActivity));
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (expireTimerRef.current) clearTimeout(expireTimerRef.current);
    };
  }, [hasToken, resetTimers]);

  return (
    <InactivityContext.Provider value={{ showExtensionModal, extendSession, logout }}>
      {children}
      {hasToken && showExtensionModal && (
        <SessionExtensionModal
          onExtend={extendSession}
          onLogout={logout}
          isExtending={isExtending}
        />
      )}
    </InactivityContext.Provider>
  );
};

export const useInactivity = () => {
  const ctx = useContext(InactivityContext);
  if (!ctx) {
    throw new Error("useInactivity debe usarse dentro de InactivityProvider");
  }
  return ctx;
};
