import Link from "next/link";
import { Music2 } from "lucide-react";

type EmptyStateProps = {
  message?: string;
  showAddLink?: boolean;
};

export function EmptyState({
  message = "No concerts logged yet. Add your first concert to start seeing your dashboard.",
  showAddLink = true,
}: EmptyStateProps) {
  return (
    <div className="surface-card">
      <div className="card-body items-center py-12 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Music2
            className="h-10 w-10 text-primary opacity-80 animate-bounce"
            style={{ animationIterationCount: 1 }}
            aria-hidden
          />
        </div>
        <p className="max-w-md text-base-content/80">{message}</p>
        <p className="mt-2 max-w-sm text-sm text-base-content/60">
          Takes about 2 minutes to add your first show.
        </p>
        {showAddLink && (
          <Link href="/concerts/add" className="btn btn-primary btn-md mt-4">
            Add your first concert
          </Link>
        )}
      </div>
    </div>
  );
}
