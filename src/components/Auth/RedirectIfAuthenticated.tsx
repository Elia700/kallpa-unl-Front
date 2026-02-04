"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DASHBOARD_PATH = "/pages/participant";

export default function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [shouldRenderLogin, setShouldRenderLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace(DASHBOARD_PATH);
    } else {
      setShouldRenderLogin(true);
    }
  }, [router]);

  // Evitar flash del formulario de login mientras se verifica el token
  if (!shouldRenderLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#5e5ce6] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
