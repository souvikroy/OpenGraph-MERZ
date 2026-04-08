import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, AlertCircle, ChevronRight, Mic,
  MessageSquare, Copy, Download, Send,
} from 'lucide-react';
import type { ProductBrand, HCPSentiment } from '../types';
import ProductBadge from '../components/shared/ProductBadge';
import ComplianceBadge from '../components/shared/ComplianceBadge';

const PRODUCTS: ProductBrand[] = ['Xeomin', 'Belotero', 'Radiesse', 'Ultherapy'];
const COMPETITORS = ['Botox', 'Dysport', 'Juvederm', 'Restylane', 'Sculptra', 'Dysport'];

const SENTIMENT_OPTIONS: { value: HCPSentiment; label: string; color: string }[] = [
  { value: 'positive', label: '😊 Positive', color: 'border-compliance-compliant bg-compliance-compliant-bg text-compliance-compliant' },
  { value: 'neutral', label: '😐 Neutral', color: 'border-merz-teal bg-merz-teal-light text-merz-teal' },
  { value: 'negative', label: '😟 Negative', color: 'border-compliance-off-label bg-compliance-off-label-bg text-compliance-off-label' },
];

type RecapStep = 'form' | 'crm' | 'email';

// Pre-filled from the voice transcript for demo
const PREFILLED = {
  productsDiscussed: ['Belotero'] as ProductBrand[],
  hcpSentiment: 'neutral' as HCPSentiment,
  sentimentNotes: 'Dr. Al-Hashim was politely engaged but not yet committed. She showed interest in CPM technology.',
  competitorMentions: ['Restylane'],
  volumeDiscussed: 'Not discussed — too early stage',
  aspDiscussed: 'Not discussed',
  samplesLeft: '1 × Belotero Balance 1ml',
  nextSteps: 'Follow up with EMERGE study data. Invite to upcoming Belotero hands-on workshop in Dubai.',
  nextVisitDate: '2026-04-22',
};

export default function StructuredRecap() {
  const navigate = useNavigate();
  const [step, setStep] = useState<RecapStep>('form');
  const [form, setForm] = useState(PREFILLED);
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [crmConfirmed, setCrmConfirmed] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const copyField = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(c => ({ ...c, [key]: true }));
    setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 2000);
  };

  const toggleProduct = (p: ProductBrand) => {
    setForm(f => ({
      ...f,
      productsDiscussed: f.productsDiscussed.includes(p)
        ? f.productsDiscussed.filter(x => x !== p)
        : [...f.productsDiscussed, p],
    }));
  };

  const toggleCompetitor = (c: string) => {
    setForm(f => ({
      ...f,
      competitorMentions: f.competitorMentions.includes(c)
        ? f.competitorMentions.filter(x => x !== c)
        : [...f.competitorMentions, c],
    }));
  };

  const allFieldsFilled =
    form.productsDiscussed.length > 0 &&
    form.hcpSentiment &&
    form.sentimentNotes &&
    form.nextSteps &&
    form.nextVisitDate;

  // ── CRM Output ────────────────────────────────────────────────────────────
  if (step === 'crm') {
    const crmFields = [
      { label: 'Products Detailed', key: 'products', value: form.productsDiscussed.join(', ') },
      { label: 'HCP Feedback / Sentiment', key: 'sentiment', value: `${form.hcpSentiment.charAt(0).toUpperCase() + form.hcpSentiment.slice(1)} — ${form.sentimentNotes}` },
      { label: 'Competitor Products Mentioned', key: 'competitors', value: form.competitorMentions.join(', ') || 'None' },
      { label: 'Volume / Units Discussed', key: 'volume', value: form.volumeDiscussed },
      { label: 'ASP Discussed', key: 'asp', value: form.aspDiscussed },
      { label: 'Samples Left', key: 'samples', value: form.samplesLeft },
      { label: 'Next Steps / Follow-up Actions', key: 'nextSteps', value: form.nextSteps },
      { label: 'Next Visit Date', key: 'nextVisit', value: form.nextVisitDate },
    ];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('form')} className="btn-ghost"><ArrowLeft size={15} /></button>
          <div>
            <h1 className="page-title">CRM-Ready Output</h1>
            <p className="page-subtitle">Copy each field into OCE post-call notes</p>
          </div>
        </div>

        {/* Progress tracker */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            {[
              { key: 'recap', label: '1. Recap', done: true },
              { key: 'crm', label: '2. CRM Entry', done: crmConfirmed },
              { key: 'email', label: '3. Follow-up Email', done: emailSent },
            ].map((s, i, arr) => (
              <div key={s.key} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  s.done ? 'bg-compliance-compliant text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s.done ? <CheckCircle size={13} /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${s.done ? 'text-compliance-compliant' : 'text-merz-slate-light'}`}>
                  {s.label}
                </span>
                {i < arr.length - 1 && <div className="flex-1 h-px bg-merz-border" />}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-merz-teal-light rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={15} className="text-merz-teal shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-merz-teal">How to use</p>
            <p className="text-xs text-merz-teal-dark mt-1">
              Open OCE on a second tab. Select Dr. Sara Al-Hashim. Copy each field below and paste into the matching OCE field. Confirm entry when done.
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="card divide-y divide-merz-border">
          {crmFields.map(field => (
            <div key={field.key} className="p-4 flex items-start gap-3">
              <div className="flex-1">
                <p className="form-label">{field.label}</p>
                <p className="text-sm text-merz-slate mt-1 bg-gray-50 rounded-lg px-3 py-2 border border-merz-border">
                  {field.value}
                </p>
              </div>
              <button
                onClick={() => copyField(field.key, field.value)}
                className={`btn-ghost shrink-0 mt-5 ${copied[field.key] ? 'text-compliance-compliant' : ''}`}
              >
                {copied[field.key] ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied[field.key] ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>

        {!crmConfirmed ? (
          <button
            onClick={() => setCrmConfirmed(true)}
            className="w-full btn-primary justify-center py-3"
          >
            <CheckCircle size={15} />
            Confirm CRM Entry Complete
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-compliance-compliant-bg border border-compliance-compliant/30 rounded-xl px-4 py-3">
              <CheckCircle size={16} className="text-compliance-compliant" />
              <p className="text-sm font-semibold text-compliance-compliant">CRM entry confirmed</p>
            </div>
            <button
              onClick={() => setStep('email')}
              className="w-full btn-primary justify-center py-3"
            >
              Generate Follow-up Email
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Follow-up Email ───────────────────────────────────────────────────────
  if (step === 'email') {
    const emailSubject = `Follow-up: Belotero Balance — Emirates Aesthetic Meeting | Merz Middle East`;
    const emailBody = `Dear Dr. Al-Hashim,

Thank you for your time today at Kaya Clinic JBR. It was a pleasure discussing the Belotero range with you, and I appreciated your thoughtful questions about the Cohesive Polydensified Matrix (CPM) technology.

As promised, I'm sharing the EMERGE clinical study data, which demonstrates 98% investigator-assessed improvement with Belotero Balance at 1 month for nasolabial folds — validating the natural, seamless integration you and I discussed.

I'd also like to formally invite you to our upcoming Belotero Hands-On Workshop in Dubai on May 8th, 2026. This will be an excellent opportunity to experience the different Belotero SKUs in a clinical demonstration setting alongside colleagues from the UAE.

Please find attached:
• EMERGE Clinical Study Summary (Belotero Balance, NLF indication)
• Belotero Range Overview — CPM Technology Explained
• Workshop Invitation & Registration Link

I'll follow up later this week to answer any remaining questions. Please don't hesitate to contact me directly in the meantime.

Best regards,
James Mitchell
Territory Manager — UAE (Dubai)
Merz Aesthetics Middle East
james.mitchell@merz.ae`;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('crm')} className="btn-ghost"><ArrowLeft size={15} /></button>
          <div>
            <h1 className="page-title">Follow-up Email</h1>
            <p className="page-subtitle">AI-generated from approved materials · Review before sending</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          {/* Email header */}
          <div className="p-4 border-b border-merz-border bg-gray-50">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-merz-slate-light w-12">To:</span>
                <span className="text-sm text-merz-slate">Dr. Sara Al-Hashim &lt;sara.al-hashim@kayaclinic.ae&gt;</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-merz-slate-light w-12">From:</span>
                <span className="text-sm text-merz-slate">james.mitchell@merz.ae</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-semibold text-merz-slate-light w-12">Subject:</span>
                <span className="text-sm font-medium text-merz-slate flex-1">{emailSubject}</span>
                <button onClick={() => copyField('subject', emailSubject)} className="btn-ghost text-xs px-2 py-1 shrink-0">
                  {copied['subject'] ? 'Copied!' : <><Copy size={11} /> Copy</>}
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-bold text-merz-slate-light uppercase tracking-wide">Email Body</p>
              <button onClick={() => copyField('body', emailBody)} className="btn-secondary text-xs">
                {copied['body'] ? <CheckCircle size={13} /> : <Copy size={13} />}
                {copied['body'] ? 'Copied!' : 'Copy Full Email'}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-merz-border text-xs text-merz-slate leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto font-mono">
              {emailBody}
            </div>
          </div>

          {/* Attachments */}
          <div className="p-4 border-t border-merz-border">
            <p className="text-xs font-bold text-merz-slate-light uppercase tracking-wide mb-3">Suggested Attachments</p>
            <div className="space-y-2">
              {[
                { name: 'EMERGE_Clinical_Study_Summary_Belotero.pdf', size: '1.2 MB' },
                { name: 'Belotero_Range_Overview_CPM_Technology.pdf', size: '3.4 MB' },
                { name: 'Belotero_Workshop_Invitation_Dubai_May2026.pdf', size: '0.8 MB' },
              ].map((att, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-merz-border">
                  <div className="w-7 h-7 rounded bg-red-100 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-red-500">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-merz-slate truncate">{att.name}</p>
                    <p className="text-[10px] text-merz-slate-light">{att.size}</p>
                  </div>
                  <button className="btn-ghost text-xs px-2 py-1 shrink-0">
                    <Download size={12} /> Save
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance note */}
        <div className="flex items-start gap-2.5 bg-merz-teal-light rounded-xl p-3.5">
          <CheckCircle size={14} className="text-merz-teal shrink-0 mt-0.5" />
          <p className="text-xs text-merz-teal-dark leading-relaxed">
            All clinical claims in this email are sourced from approved Merz materials. References to the EMERGE study include required disclaimer language per Medical Affairs guidelines.
          </p>
        </div>

        {!emailSent ? (
          <div className="flex gap-3">
            <button className="flex-1 btn-secondary justify-center">Edit Email</button>
            <button
              onClick={() => setEmailSent(true)}
              className="flex-1 btn-primary justify-center"
            >
              <Send size={14} />
              Confirm Email Sent
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-compliance-compliant-bg border border-compliance-compliant/30 rounded-xl px-4 py-3">
              <CheckCircle size={16} className="text-compliance-compliant" />
              <p className="text-sm font-semibold text-compliance-compliant">All post-meeting tasks complete!</p>
            </div>
            <button onClick={() => navigate('/sales-companion/post-meeting/history')} className="w-full btn-secondary justify-center">
              Back to Meeting History
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Recap Form ────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/sales-companion/post-meeting/recap')} className="btn-ghost">
          <ArrowLeft size={15} />
        </button>
        <div>
          <h1 className="page-title">Structured Recap</h1>
          <p className="page-subtitle">Dr. Sara Al-Hashim · Apr 1, 2026 · Kaya Clinic JBR</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center gap-1.5 text-xs text-merz-teal bg-merz-teal-light px-3 py-1.5 rounded-lg">
            <Mic size={12} />
            AI-extracted from voice
          </div>
        </div>
      </div>

      {/* AI follow-up question banner */}
      <div className="bg-compliance-pv-flag-bg border border-compliance-pv-flag/30 rounded-xl p-4 flex items-start gap-3">
        <MessageSquare size={15} className="text-compliance-pv-flag shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-compliance-pv-flag">AI Follow-up Question</p>
          <p className="text-xs text-merz-slate-mid mt-1">
            You mentioned Belotero but didn't mention whether you discussed any volume or ordering quantities. Did the HCP indicate any interest in placing an order?
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Products discussed */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="form-label mb-0">Products Discussed *</label>
            {form.productsDiscussed.length > 0 ? (
              <CheckCircle size={14} className="text-compliance-compliant" />
            ) : (
              <AlertCircle size={14} className="text-compliance-off-label" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map(p => (
              <button
                key={p}
                onClick={() => toggleProduct(p)}
                className={`transition-all rounded-lg border-2 p-2 ${
                  form.productsDiscussed.includes(p)
                    ? 'border-merz-teal bg-merz-teal-light'
                    : 'border-merz-border hover:border-merz-teal/40'
                }`}
              >
                <ProductBadge product={p} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* HCP Sentiment */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="form-label mb-0">HCP Feedback / Sentiment *</label>
            {form.hcpSentiment ? <CheckCircle size={14} className="text-compliance-compliant" /> : <AlertCircle size={14} className="text-compliance-off-label" />}
          </div>
          <div className="flex gap-2 mb-3">
            {SENTIMENT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setForm(f => ({ ...f, hcpSentiment: opt.value }))}
                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.hcpSentiment === opt.value
                    ? opt.color
                    : 'border-merz-border text-merz-slate-mid hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <textarea
            rows={2}
            className="form-input resize-none"
            placeholder="Brief description of HCP reaction..."
            value={form.sentimentNotes}
            onChange={e => setForm(f => ({ ...f, sentimentNotes: e.target.value }))}
          />
        </div>

        {/* Competitor mentions */}
        <div className="card p-4">
          <label className="form-label">Competitor Products Mentioned</label>
          <div className="flex flex-wrap gap-2">
            {COMPETITORS.map(c => (
              <button
                key={c}
                onClick={() => toggleCompetitor(c)}
                className={`badge cursor-pointer transition-all ${
                  form.competitorMentions.includes(c)
                    ? 'badge-amber'
                    : 'badge-gray hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Other fields */}
        <div className="card p-4 space-y-4">
          {[
            { label: 'Samples Left', key: 'samplesLeft', placeholder: 'e.g. 2 × Xeomin 50U vials' },
            { label: 'Volume / Units Discussed', key: 'volumeDiscussed', placeholder: 'e.g. 50 units/month current usage' },
            { label: 'ASP Discussed', key: 'aspDiscussed', placeholder: 'e.g. Standard pricing confirmed' },
          ].map(field => (
            <div key={field.key}>
              <label className="form-label">{field.label}</label>
              <input
                type="text"
                className="form-input"
                placeholder={field.placeholder}
                value={(form as any)[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        <div className="card p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="form-label mb-0">Next Steps / Follow-up Actions *</label>
              {form.nextSteps ? <CheckCircle size={14} className="text-compliance-compliant" /> : <AlertCircle size={14} className="text-compliance-off-label" />}
            </div>
            <textarea
              rows={3}
              className="form-input resize-none mt-1.5"
              placeholder="Specific commitments made, deliverables..."
              value={form.nextSteps}
              onChange={e => setForm(f => ({ ...f, nextSteps: e.target.value }))}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="form-label mb-0">Next Visit Date *</label>
              {form.nextVisitDate ? <CheckCircle size={14} className="text-compliance-compliant" /> : <AlertCircle size={14} className="text-compliance-off-label" />}
            </div>
            <input
              type="date"
              className="form-input mt-1.5"
              value={form.nextVisitDate}
              onChange={e => setForm(f => ({ ...f, nextVisitDate: e.target.value }))}
            />
          </div>
        </div>

        {/* Compliance auto-flags */}
        <div className="card p-4">
          <label className="form-label mb-2">Auto-detected Compliance Flags</label>
          <div className="flex flex-wrap gap-2">
            <ComplianceBadge flag="competitive" />
            <span className="text-xs text-merz-slate-light ml-1 self-center">Restylane mentioned – logged for Marketing Intelligence</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        disabled={!allFieldsFilled}
        onClick={() => setStep('crm')}
        className="w-full btn-primary justify-center py-3 disabled:opacity-50"
      >
        {allFieldsFilled ? (
          <>Finalise Recap & Generate CRM Output <ChevronRight size={15} /></>
        ) : (
          'Complete all required fields (*) to continue'
        )}
      </button>
    </div>
  );
}
