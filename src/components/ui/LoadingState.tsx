type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading…",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="text-sm text-base-content/70">{message}</p>
    </div>
  );
}
