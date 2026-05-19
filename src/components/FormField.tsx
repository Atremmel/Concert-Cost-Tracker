import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  helper?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  helper,
  required,
  children,
}: FormFieldProps) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-4">
      <label htmlFor={htmlFor} className="text-sm font-medium sm:text-right">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <div className="min-w-0 rounded-lg focus-within:ring-2 focus-within:ring-primary/30">
        {children}
        {helper && (
          <p className="mt-1 text-xs text-base-content/60">{helper}</p>
        )}
      </div>
    </div>
  );
}
