import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 border border-dashed border-garis bg-putih px-6 py-12 text-center ${className}`}
    >
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center border border-garis bg-gading text-magenta">
          {icon}
        </div>
      ) : null}
      <h2 className="text-base font-semibold text-plum">{title}</h2>
      {description ? (
        <p className="max-w-md text-sm leading-6 text-teks-sekunder">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
