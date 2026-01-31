"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/context/SessionContext";
import { SessionErrorModal } from "@/components/SessionErrorModal/SessionErrorModal";
import { ServerDown } from "@/components/ServerDown/ServerDown";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <SessionProvider>
        <SidebarProvider>
          {children}
          <SessionErrorModal />
          <ServerDown />
        </SidebarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
