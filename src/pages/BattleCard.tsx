import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Target,
  BarChart2,
  AlertCircle,
  Lightbulb,
  Brain,
} from 'lucide-react';
import { format } from 'date-fns';
import { getMeetingById } from '../data/mockMeetings';
import ProductBadge from '../components/shared/ProductBadge';

// Hardcoded rich battle card for demo HCP interaction history
const INTERACTION_HISTORY = [
  { date: '2026-03-28', product: 'Xeomin', outcome: 'Positive – requested dosing charts', type: 'Visit' },
  { date: '2026-02-14', product: 'Xeomin', outcome: 'Neutral – mentioned Botox comparison', type: 'Visit' },
  { date: '2026-01-09', product: 'Xeomin, Belotero', outcome: 'Positive – placed order 50U', type: 'Visit' },
  { date: '2025-12-03', product: 'Xeomin', outcome: 'Positive – attended hands-on workshop', type: 'Event' },
];

const TALKING_POINTS = [
  {
    product: 'Xeomin' as const,
    point: 'Naked toxin advantage: complexing protein-free formulation may reduce antibody formation risk',
    priority: 'high',
  },
  {
    product: 'Xeomin' as const,
    point: 'Follow up on dosing chart request from last visit – bring printed materials',
    priority: 'high',
  },
  {
    product: 'Belotero' as const,
    point: 'Introduce new Belotero Balance+ – enhanced longevity vs. previous formulation',
    priority: 'medium',
  },
  {
    product: 'Xeomin' as const,
    point: 'Volume growth discussion: from 50U/month → 80U/month target with Q2 pricing incentive',
    priority: 'medium',
  },
];

const COMPETITIVE_INTEL = [
  {
    competitor: 'Botox',
    note: 'Dr. Al-Rashid has mentioned Botox pricing comparison in 2 of last 3 visits. Prepare cost-per-unit analysis.',
  },
  {
    competitor: 'Juvederm',
    note: 'Clinic stocks Juvederm Ultra for lip augmentation. Belotero Intense opportunity to displace.',
  },
];

export default function BattleCard() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const meeting = getMeetingById(meetingId || '');

  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-merz-slate-light">Meeting not found</p>
        <button onClick={() => navigate(-1)} className="btn-secondary mt-3">Go Back</button>
      </div>
    );
  }

  const hcp = meeting.hcp;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button onClick={() => navigate('/sales-companion/pre-meeting/meetings')} className="btn-ghost self-start">
          <ArrowLeft size={15} />
          Meetings
        </button>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate('/sales-companion/pre-meeting/quiz')}
            className="btn-secondary"
          >
            <Brain size={14} />
            Start Pre-Meeting Quiz
          </button>
          <button
            onClick={() => navigate('/product-expert/chat')}
            className="btn-ghost"
          >
            <MessageSquare size={14} />
            Ask Product Expert
          </button>
        </div>
      </div>

      {/* HCP Header Card */}
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-merz-teal to-merz-teal-dark p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {hcp.name.split(' ').filter(w => w !== 'Dr.').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">{hcp.name}</h1>
                  <p className="text-white/80 text-sm">{hcp.specialty} · {hcp.clinic}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="badge bg-white/20 text-white border border-white/30 text-xs">{hcp.tier}</span>
                  <span className="badge bg-white/20 text-white border border-white/30 text-xs">{hcp.market} · {hcp.territory}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <Clock size={13} />
                  {meeting.time} · {meeting.duration} min
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <MapPin size={13} />
                  {meeting.location}
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <BarChart2 size={13} />
                  {hcp.totalVisits} total visits
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting products */}
        <div className="px-5 py-3 bg-gray-50 border-b border-merz-border flex items-center gap-3">
          <p className="text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Today's Focus:</p>
          <div className="flex gap-2">
            {meeting.products.map(p => <ProductBadge key={p} product={p} />)}
          </div>
          <p className="ml-auto text-xs text-merz-slate-light">
            Last visit: {format(new Date(hcp.lastVisitDate), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Recommended Talking Points */}
          <div className="card">
            <div className="p-4 border-b border-merz-border flex items-center gap-2">
              <Target size={16} className="text-merz-teal" />
              <span className="section-header">Recommended Talking Points</span>
              <span className="ml-auto badge-teal text-[10px]">AI Generated</span>
            </div>
            <div className="divide-y divide-merz-border">
              {TALKING_POINTS.map((tp, i) => (
                <div key={i} className="p-4 flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                    tp.priority === 'high' ? 'bg-compliance-off-label' : 'bg-compliance-pv-flag'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-merz-slate">{tp.point}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <ProductBadge product={tp.product} size="sm" />
                      <span className={`badge text-[10px] px-1.5 ${
                        tp.priority === 'high' ? 'badge-red' : 'badge-amber'
                      }`}>
                        {tp.priority === 'high' ? 'High priority' : 'Medium priority'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Objectives */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-merz-teal" />
              <span className="section-header">Meeting Objectives</span>
            </div>
            <div className="space-y-2">
              {meeting.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-merz-teal-light text-merz-teal text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-merz-slate">{obj}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interaction History */}
          <div className="card">
            <div className="p-4 border-b border-merz-border flex items-center gap-2">
              <Clock size={16} className="text-merz-teal" />
              <span className="section-header">Interaction History</span>
              <span className="text-xs text-merz-slate-light ml-1">Last 12 months</span>
            </div>
            <div className="divide-y divide-merz-border">
              {INTERACTION_HISTORY.map((h, i) => (
                <div key={i} className="p-3.5 flex items-start gap-3">
                  <div className="w-16 shrink-0">
                    <p className="text-[11px] font-semibold text-merz-slate-light">
                      {format(new Date(h.date), 'MMM d')}
                    </p>
                    <p className="text-[10px] text-merz-slate-light">{format(new Date(h.date), 'yyyy')}</p>
                  </div>
                  <div className="w-px bg-merz-border self-stretch mx-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="badge-gray text-[10px]">{h.type}</span>
                      <span className="text-[11px] text-merz-teal font-medium">{h.product}</span>
                    </div>
                    <p className="text-xs text-merz-slate">{h.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-5">
          {/* HCP Prescribing Profile */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-merz-teal" />
              <span className="section-header">Prescribing Profile</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1.5">Merz Products</p>
                <div className="flex flex-wrap gap-1.5">
                  {hcp.prescribingProducts.map(p => <ProductBadge key={p} product={p} size="sm" />)}
                </div>
              </div>
              {hcp.competitorProducts.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1.5">Competitor Products</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hcp.competitorProducts.map(c => (
                      <span key={c} className="badge badge-gray">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Competitive Intelligence */}
          {COMPETITIVE_INTEL.length > 0 && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={16} className="text-compliance-pv-flag" />
                <span className="section-header">Competitive Intel</span>
              </div>
              <div className="space-y-3">
                {COMPETITIVE_INTEL.map((ci, i) => (
                  <div key={i} className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <p className="text-xs font-bold text-compliance-pv-flag mb-1">{ci.competitor}</p>
                    <p className="text-xs text-merz-slate-mid leading-relaxed">{ci.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Open Follow-ups */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-merz-teal" />
              <span className="section-header">Open Follow-ups</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-2.5 bg-merz-teal-light rounded-lg">
                <ChevronRight size={13} className="text-merz-teal shrink-0 mt-0.5" />
                <p className="text-xs text-merz-slate">Send updated Xeomin dosing chart PDF</p>
              </div>
              <div className="flex items-start gap-2 p-2.5 bg-merz-teal-light rounded-lg">
                <ChevronRight size={13} className="text-merz-teal shrink-0 mt-0.5" />
                <p className="text-xs text-merz-slate">Q2 volume discount discussion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
