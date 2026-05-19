"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Concert } from "@/lib/types";
import { formatDate, formatCurrency, totalCost } from "@/lib/concert-math";
import { uploadSetlistFile } from "@/lib/setlist";
import { SetlistFields } from "./SetlistFields";
import { SetlistDisplay } from "./SetlistDisplay";
import { FeedbackAlert } from "@/components/ui/FeedbackAlert";
import { LoadingState } from "@/components/ui/LoadingState";
import { PageHeader } from "@/components/ui/PageHeader";

type ConcertDetailProps = {
  concertId: string;
};

export function ConcertDetail({ concertId }: ConcertDetailProps) {
  const router = useRouter();
  const supabase = createClient();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [setlistText, setSetlistText] = useState("");
  const [setlistFile, setSetlistFile] = useState<File | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error: fetchError } = await supabase
        .from("concerts")
        .select("*")
        .eq("id", concertId)
        .single();

      if (cancelled) return;

      if (fetchError || !data) {
        setError(fetchError?.message ?? "Concert not found.");
        setLoading(false);
        return;
      }

      const row = data as Concert;
      setConcert(row);
      setSetlistText(row.setlist_text ?? "");
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [concertId, supabase]);

  const handleSaveSetlist = async () => {
    if (!concert) return;

    setSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You need to be logged in.");
      setSaving(false);
      return;
    }

    let filePath = concert.setlist_file_path;

    if (setlistFile) {
      const upload = await uploadSetlistFile(
        supabase,
        user.id,
        concert.id,
        setlistFile,
        concert.setlist_file_path,
      );
      if (upload.error) {
        setError(upload.error);
        setSaving(false);
        return;
      }
      filePath = upload.path;
    }

    const { error: updateError } = await supabase
      .from("concerts")
      .update({
        setlist_text: setlistText.trim() || null,
        setlist_file_path: filePath,
      })
      .eq("id", concert.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setConcert((prev) =>
      prev
        ? {
            ...prev,
            setlist_text: setlistText.trim() || null,
            setlist_file_path: filePath,
          }
        : null,
    );
    setSetlistFile(null);
    setEditing(false);
    toast.success("Setlist saved!");
    router.refresh();
  };

  if (loading) {
    return <LoadingState message="Loading concert…" />;
  }

  if (!concert) {
    return (
      <FeedbackAlert
        variant="error"
        message={error ?? "Concert not found."}
      />
    );
  }

  const location = [concert.venue, concert.city, concert.state]
    .filter(Boolean)
    .join(" · ");
  const hasSetlist = !!(concert.setlist_text || concert.setlist_file_path);

  return (
    <div className="space-y-6">
      <Link
        href="/concerts"
        className="btn btn-ghost btn-sm gap-1 pl-0"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to concerts
      </Link>

      <PageHeader
        title={concert.concert_name}
        subtitle={concert.artist ?? undefined}
      />

      <div className="surface-card">
        <div className="card-body gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-primary gap-1">
              <Star className="h-3 w-3" aria-hidden />
              {concert.fun_rating}/10
            </span>
            <span className="text-sm font-medium">
              {formatDate(concert.concert_date)}
            </span>
            <span className="text-sm font-semibold text-primary">
              {formatCurrency(totalCost(concert))} total
            </span>
          </div>
          {location && (
            <p className="flex items-center gap-1 text-sm text-base-content/70">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {location}
            </p>
          )}
        </div>
      </div>

      <section className="surface-card">
        <div className="card-body space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Setlist</h2>
            {!editing && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setEditing(true)}
              >
                {hasSetlist ? "Edit setlist" : "Add setlist"}
              </button>
            )}
          </div>

          {error && (
            <FeedbackAlert
              variant="error"
              message={error}
              onDismiss={() => setError(null)}
            />
          )}

          {editing ? (
            <>
              <SetlistFields
                setlistText={setlistText}
                onSetlistTextChange={setSetlistText}
                file={setlistFile}
                onFileChange={setSetlistFile}
                existingFileName={concert.setlist_file_path}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`btn btn-primary btn-sm ${saving ? "loading" : ""}`}
                  disabled={saving}
                  onClick={handleSaveSetlist}
                >
                  {saving ? "Saving…" : "Save setlist"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={saving}
                  onClick={() => {
                    setEditing(false);
                    setSetlistText(concert.setlist_text ?? "");
                    setSetlistFile(null);
                    setError(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <SetlistDisplay
              setlistText={concert.setlist_text}
              setlistFilePath={concert.setlist_file_path}
            />
          )}
        </div>
      </section>
    </div>
  );
}
