"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type FeedbackAlertProps = {
  variant: "success" | "error" | "info";
  message: string;
  onDismiss?: () => void;
};

const config = {
  success: {
    className: "alert-success",
    Icon: CheckCircle2,
  },
  error: {
    className: "alert-error",
    Icon: AlertCircle,
  },
  info: {
    className: "alert-info",
    Icon: Info,
  },
};

export function FeedbackAlert({
  variant,
  message,
  onDismiss,
}: FeedbackAlertProps) {
  const { className, Icon } = config[variant];

  return (
    <div role="alert" className={`alert ${className} text-sm shadow-sm`}>
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-circle"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
