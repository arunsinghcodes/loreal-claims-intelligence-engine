import React, { useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, X } from "lucide-react";
import { IconButton } from "../ui/IconButton";

export interface NewClaimFormData {
  productName: string;
  claim: string;
  evidence: string;
  submittedBy: string;
}

export interface NewClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: NewClaimFormData) => Promise<void>;
  isSubmitting: boolean;
}

const initialFormState: NewClaimFormData = {
  productName: "",
  claim: "",
  evidence: "",
  submittedBy: "Research Team",
};

export function NewClaimModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: NewClaimModalProps) {
  const [form, setForm] = useState<NewClaimFormData>(initialFormState);

  if (!isOpen) return null;

  function updateField(field: keyof NewClaimFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    await onSubmit(form);
    setForm(initialFormState);
  }

  function handleClose() {
    onClose();
    setForm(initialFormState);
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              <Sparkles size={13} /> NEW SUBMISSION
            </span>
            <h2 id="form-title">Assess a product claim</h2>
            <p>
              Provide the claim and scientific evidence for AI-assisted
              assessment.
            </p>
          </div>
          <IconButton onClick={handleClose} aria-label="Close">
            <X size={19} />
          </IconButton>
        </div>
        <form className="claim-form" onSubmit={handleSubmit}>
          <label>
            Product name <span>*</span>
            <input
              required
              maxLength={200}
              value={form.productName}
              onChange={(event) =>
                updateField("productName", event.target.value)
              }
              placeholder="e.g. Revitalift Clinical"
            />
          </label>
          <label>
            Marketing claim <span>*</span>
            <textarea
              required
              minLength={10}
              maxLength={2000}
              rows={3}
              value={form.claim}
              onChange={(event) => updateField("claim", event.target.value)}
              placeholder="What does the product claim to do?"
            />
          </label>
          <label>
            Scientific evidence <span>*</span>
            <textarea
              required
              minLength={20}
              maxLength={50000}
              rows={6}
              value={form.evidence}
              onChange={(event) => updateField("evidence", event.target.value)}
              placeholder="Paste the study summary, methodology, sample size, outcomes and results..."
            />
            <small>
              Include study design, sample size, measurements and statistical
              results where available.
            </small>
          </label>
          <label>
            Submitted by
            <input
              maxLength={100}
              value={form.submittedBy}
              onChange={(event) =>
                updateField("submittedBy", event.target.value)
              }
            />
          </label>
          <div className="form-disclaimer">
            <ShieldCheck size={17} />
            <p>
              AI results are decision support only. A qualified reviewer must
              verify the evidence before any claim is approved.
            </p>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              <Sparkles size={16} />
              {isSubmitting ? "Assessing claim..." : "Add claim"}
              {!isSubmitting && <ArrowRight size={15} />}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

