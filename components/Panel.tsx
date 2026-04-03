import { ReactNode } from "react";

export default function Panel({
  children,
  className = "",
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={`border border-border bg-bg-panel rounded-xl p-6 shadow-sm ${className}`}>
      {title && (
        <h3 className="text-xs text-text-secondary font-semibold mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
