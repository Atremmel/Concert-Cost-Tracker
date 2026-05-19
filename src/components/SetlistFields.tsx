"use client";

import { FormField } from "./FormField";

type SetlistFieldsProps = {
  setlistText: string;
  onSetlistTextChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  existingFileName?: string | null;
};

export function SetlistFields({
  setlistText,
  onSetlistTextChange,
  file,
  onFileChange,
  existingFileName,
}: SetlistFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        label="Paste setlist"
        htmlFor="setlist_text"
        helper="One song per line. Optional."
      >
        <textarea
          id="setlist_text"
          className="textarea textarea-bordered w-full font-mono text-sm"
          rows={8}
          placeholder={"Song 1\nSong 2\nEncore: Song 3"}
          value={setlistText}
          onChange={(e) => onSetlistTextChange(e.target.value)}
        />
      </FormField>
      <FormField
        label="Upload setlist file"
        htmlFor="setlist_file"
        helper="Optional .txt or image (JPEG, PNG, WebP), max 5 MB."
      >
        <input
          id="setlist_file"
          type="file"
          accept=".txt,text/plain,image/jpeg,image/png,image/webp"
          className="file-input file-input-bordered w-full"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        {file && (
          <p className="mt-1 text-sm text-base-content/70">
            Selected: {file.name}
          </p>
        )}
        {!file && existingFileName && (
          <p className="mt-1 text-sm text-base-content/70">
            Current file: {existingFileName.split("/").pop()}
          </p>
        )}
      </FormField>
    </div>
  );
}
