"use client";

import { Suspense, useState, useEffect } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { RecentActivity } from "./_components/activity/recent-activity";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default function Home({ searchParams }: PropsType) {
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const handleServerDown = () => {
      setServerDown(true);
    };

    window.addEventListener("SERVER_DOWN", handleServerDown);
    return () => window.removeEventListener("SERVER_DOWN", handleServerDown);
  }, []);

  if (serverDown) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={null}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Suspense fallback={null}>
          <div className="col-span-full">
            <RecentActivity />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
