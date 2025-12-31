"use client";

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string; 
}

export default function Loader({ size = 50, color = "text-blue-500", className = "" }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-4 border-t-4 border-gray-200 ${color}`}
        style={{ width: size, height: size, borderTopColor: "currentColor" }}
      ></div>
    </div>
  );
}
