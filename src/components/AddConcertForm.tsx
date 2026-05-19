"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { totalCost, formatCurrency } from "@/lib/concert-math";
import { COST_FIELDS } from "@/lib/types";
import { FormField } from "./FormField";
import { FeedbackAlert } from "@/components/ui/FeedbackAlert";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { SetlistFields } from "./SetlistFields";
import { uploadSetlistFile } from "@/lib/setlist";

const emptyForm = {
  concert_name: "",
  artist: "",
  venue: "",
  city: "",
  state: "",
  concert_date: "",
  distance_from_home: "",
  hours_at_event: "",
  ticket_cost: "0",
  ticket_fees: "0",
  parking_cost: "0",
  food_drink_cost: "0",
  merchandise_cost: "0",
  lodging_cost: "0",
  travel_cost: "0",
  other_cost: "0",
  fun_rating: 7,
  notes: "",
};

const FUN_LABELS: Record<number, string> = {
  1: "Terrible Time",
  2: "Rough",
  3: "Meh",
  4: "Okay",
  5: "Fine",
  6: "Good",
  7: "Great",
  8: "Awesome",
  9: "Amazing",
  10: "Best Time Ever",
};

function SectionHeader({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
        {step}
      </span>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

export function AddConcertForm() {
  const router = useRouter();
  const supabase = createClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [setlistText, setSetlistText] = useState("");
  const [setlistFile, setSetlistFile] = useState<File | null>(null);

  const costs = useMemo(
    () => ({
      ticket_cost: Number(form.ticket_cost) || 0,
      ticket_fees: Number(form.ticket_fees) || 0,
      parking_cost: Number(form.parking_cost) || 0,
      food_drink_cost: Number(form.food_drink_cost) || 0,
      merchandise_cost: Number(form.merchandise_cost) || 0,
      lodging_cost: Number(form.lodging_cost) || 0,
      travel_cost: Number(form.travel_cost) || 0,
      other_cost: Number(form.other_cost) || 0,
    }),
    [form],
  );

  const liveTotal = totalCost(costs);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const update = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You need to be logged in to save a concert.");
      setLoading(false);
      return;
    }

    const { data: inserted, error: insertError } = await supabase
      .from("concerts")
      .insert({
        user_id: user.id,
        concert_name: form.concert_name.trim(),
        artist: form.artist.trim() || null,
        venue: form.venue.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        concert_date: form.concert_date,
        distance_from_home: form.distance_from_home
          ? Number(form.distance_from_home)
          : null,
        hours_at_event: form.hours_at_event
          ? Number(form.hours_at_event)
          : null,
        ...costs,
        fun_rating: form.fun_rating,
        notes: form.notes.trim() || null,
        setlist_text: setlistText.trim() || null,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      setLoading(false);
      setError(insertError?.message ?? "Could not save concert.");
      return;
    }

    if (setlistFile) {
      const upload = await uploadSetlistFile(
        supabase,
        user.id,
        inserted.id,
        setlistFile,
      );
      if (upload.error) {
        setLoading(false);
        setError(upload.error);
        return;
      }
      if (upload.path) {
        const { error: pathError } = await supabase
          .from("concerts")
          .update({ setlist_file_path: upload.path })
          .eq("id", inserted.id);
        if (pathError) {
          setLoading(false);
          setError(pathError.message);
          return;
        }
      }
    }

    setLoading(false);
    setSuccess(true);
    setForm(emptyForm);
    setSetlistText("");
    setSetlistFile(null);
    toast.success("Concert saved!", {
      description: "Add another or check your dashboard.",
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    router.refresh();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 pb-24 sm:pb-6">
      {success && (
        <FeedbackAlert
          variant="success"
          message="Concert saved! Add another or check your dashboard."
        />
      )}
      {error && (
        <FeedbackAlert
          variant="error"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      <section className="surface-card">
        <div className="card-body space-y-4">
          <SectionHeader step={1} title="Concert details" />
          <FormField label="Concert name" htmlFor="concert_name" required>
            <input
              id="concert_name"
              className="input input-bordered input-md w-full"
              value={form.concert_name}
              onChange={(e) => update("concert_name", e.target.value)}
              required
            />
          </FormField>
          <FormField label="Artist or band" htmlFor="artist">
            <input
              id="artist"
              className="input input-bordered input-md w-full"
              value={form.artist}
              onChange={(e) => update("artist", e.target.value)}
            />
          </FormField>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Venue" htmlFor="venue">
              <input
                id="venue"
                className="input input-bordered input-md w-full"
                value={form.venue}
                onChange={(e) => update("venue", e.target.value)}
              />
            </FormField>
            <FormField label="City" htmlFor="city">
              <input
                id="city"
                className="input input-bordered input-md w-full"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="State" htmlFor="state">
              <input
                id="state"
                className="input input-bordered input-md w-full"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
              />
            </FormField>
            <FormField label="Concert date" htmlFor="concert_date" required>
              <input
                id="concert_date"
                type="date"
                className="input input-bordered input-md w-full"
                value={form.concert_date}
                onChange={(e) => update("concert_date", e.target.value)}
                required
              />
            </FormField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label="Distance from home (mi)"
              htmlFor="distance_from_home"
              helper="Optional — how far you traveled."
            >
              <input
                id="distance_from_home"
                type="number"
                min="0"
                step="0.1"
                className="input input-bordered input-md w-full"
                value={form.distance_from_home}
                onChange={(e) => update("distance_from_home", e.target.value)}
              />
            </FormField>
            <FormField
              label="Hours at event"
              htmlFor="hours_at_event"
              helper="Used to calculate cost per hour."
            >
              <input
                id="hours_at_event"
                type="number"
                min="0"
                step="0.5"
                className="input input-bordered input-md w-full"
                value={form.hours_at_event}
                onChange={(e) => update("hours_at_event", e.target.value)}
              />
            </FormField>
          </div>
          <FormField label="Notes" htmlFor="notes">
            <textarea
              id="notes"
              className="textarea textarea-bordered w-full"
              rows={3}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </FormField>
        </div>
      </section>

      <section className="surface-card">
        <div className="card-body space-y-4">
          <SectionHeader step={2} title="Costs" />
          <div className="flex justify-end">
            <span className="badge badge-primary badge-lg gap-1 px-4 py-3 text-sm font-semibold">
              Total:{" "}
              <AnimatedNumber value={liveTotal} format={formatCurrency} />
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {COST_FIELDS.map(({ key, label }) => (
              <FormField key={key} label={label} htmlFor={key}>
                <input
                  id={key}
                  type="number"
                  min="0"
                  step="0.01"
                  className="input input-bordered input-md w-full"
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                />
              </FormField>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card">
        <div className="card-body space-y-4">
          <SectionHeader step={3} title="Setlist (optional)" />
          <SetlistFields
            setlistText={setlistText}
            onSetlistTextChange={setSetlistText}
            file={setlistFile}
            onFileChange={setSetlistFile}
          />
        </div>
      </section>

      <section className="surface-card">
        <div className="card-body space-y-4">
          <SectionHeader step={4} title="How fun was it?" />
          <p className="text-sm text-base-content/70">
            Rate from 1 (Terrible Time) to 10 (Best Time Ever).
          </p>
          <input
            type="range"
            min={1}
            max={10}
            value={form.fun_rating}
            className="range range-primary"
            onChange={(e) => update("fun_rating", Number(e.target.value))}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-base-content/60">1 — Terrible Time</span>
            <span className="text-center text-sm font-semibold text-primary">
              {form.fun_rating} — {FUN_LABELS[form.fun_rating]}
            </span>
            <span className="text-right text-xs text-base-content/60 sm:text-right">
              10 — Best Time Ever
            </span>
          </div>
        </div>
      </section>

      <div className="sticky-form-footer flex items-center justify-between gap-3 sm:justify-start">
        <span className="text-sm font-semibold text-primary sm:hidden">
          Total: <AnimatedNumber value={liveTotal} format={formatCurrency} />
        </span>
        <button
          type="submit"
          className={`btn btn-primary btn-md min-h-11 w-full sm:w-auto ${
            loading ? "loading" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving…" : "Save concert"}
        </button>
      </div>
    </form>
  );
}
