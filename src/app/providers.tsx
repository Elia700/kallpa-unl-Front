"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/context/SessionContext";
import { InactivityProvider } from "@/context/InactivityContext";
import { SessionErrorModal } from "@/components/SessionErrorModal/SessionErrorModal";
import { ServerDown } from "@/components/ServerDown/ServerDown";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <SessionProvider>
        <InactivityProvider>
          <SidebarProvider>
            {children}
            <SessionErrorModal />
            <ServerDown />
          </SidebarProvider>
        </InactivityProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
