"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  fetchSetlistTextFromStorage,
  getSetlistSignedUrl,
  isSetlistImagePath,
  parseSetlistLines,
} from "@/lib/setlist";

type SetlistDisplayProps = {
  setlistText: string | null;
  setlistFilePath: string | null;
};

export function SetlistDisplay({
  setlistText,
  setlistFilePath,
}: SetlistDisplayProps) {
  const supabase = createClient();
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileText, setFileText] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!setlistFilePath);

  const lines = parseSetlistLines(setlistText);

  useEffect(() => {
    if (!setlistFilePath) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      if (isSetlistImagePath(setlistFilePath)) {
        const url = await getSetlistSignedUrl(supabase, setlistFilePath);
        if (!cancelled) {
          setFilePreview(url);
          setLoading(false);
        }
        return;
      }

      const text = await fetchSetlistTextFromStorage(supabase, setlistFilePath);
      if (!cancelled) {
        setFileText(text);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [setlistFilePath, supabase]);

  const fileLines = parseSetlistLines(fileText);
  const hasContent =
    lines.length > 0 || filePreview || fileLines.length > 0 || loading;

  if (!hasContent) {
    return (
      <p className="text-sm text-base-content/70">No setlist saved yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {lines.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-base-content/80">
            Pasted setlist
          </h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {lines.map((song, i) => (
              <li key={`${song}-${i}`}>{song}</li>
            ))}
          </ol>
        </div>
      )}

      {loading && (
        <p className="text-sm text-base-content/60">Loading setlist file…</p>
      )}

      {filePreview && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-base-content/80">
            Uploaded setlist
          </h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={filePreview}
            alt="Setlist"
            className="max-h-96 w-full rounded-lg object-contain bg-base-200"
          />
        </div>
      )}

      {!loading && fileLines.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-base-content/80">
            Uploaded setlist
          </h3>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {fileLines.map((song, i) => (
              <li key={`file-${song}-${i}`}>{song}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
