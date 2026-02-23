"use client";

import { useState, useEffect, useRef } from "react";
import { CloseIcon, FlagIcon } from "@/components/icons";

const REPORT_REASONS = [
  { value: "malware", label: "Malware / Malicious Code" },
  { value: "spam", label: "Spam / Low Quality" },
  { value: "copyright", label: "Copyright Violation" },
  { value: "other", label: "Other" },
] as const;

interface ReportModalProps {
  slug: string;
  open: boolean;
  onClose: () => void;
}

export function ReportModal({ slug, open, onClose }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/packs/${slug}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, description }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setReason("");
          setDescription("");
        }, 2000);
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Failed to submit report");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-obsidian-700 bg-obsidian-900 shadow-2xl shadow-black/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FlagIcon className="w-5 h-5 text-red-400" />
            <h2 className="font-heading font-semibold text-stone-100">Report Pack</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-200 transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <p className="text-green-400 font-medium">Report submitted. Thank you.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset>
              <legend className="text-sm font-medium text-stone-200 mb-2">Reason</legend>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                      reason === r.value
                        ? "border-ember/50 bg-ember/5"
                        : "border-obsidian-700 hover:border-obsidian-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-ember"
                    />
                    <span className="text-sm text-stone-300">{r.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label className="text-sm font-medium text-stone-200 block mb-1">
                Details (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Provide additional context..."
                className="w-full px-3 py-2 rounded-lg border border-obsidian-700 bg-obsidian-950 text-stone-200 text-sm placeholder:text-stone-500 focus:outline-none focus:border-ember/50 resize-none"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={!reason || submitting}
              className="w-full py-2.5 rounded-lg bg-red-500/80 text-white text-sm font-medium hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
