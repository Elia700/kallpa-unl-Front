"use client";

import React from "react";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
  historyLabel?: string;
  onHistory?: () => void;
}

export const EmptyState = ({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  historyLabel,
  onHistory,
}: EmptyStateProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-gray-100 bg-gray-50/50 py-12 px-4 dark:border-gray-800 dark:bg-gray-900/20">
      <div className="mb-4 rounded-full bg-white p-4 shadow-sm dark:bg-gray-800">
        <Icon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
      </div>
      
      <h3 className="mb-1 text-center font-bold text-gray-900 dark:text-white">
        {title}
      </h3>
      
      <p className="mb-6 max-w-[280px] text-center text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>

      {actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
        >
          <Plus size={18} /> {actionLabel}
        </button>
      )}

      {historyLabel && (
        <button
          onClick={onHistory}
          className="mt-4 text-xs font-bold text-blue-500 transition-colors hover:text-blue-600"
        >
          {historyLabel}
        </button>
      )}
    </div>
  );
};