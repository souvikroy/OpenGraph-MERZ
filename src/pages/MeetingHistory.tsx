import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle, AlertCircle, Mic } from 'lucide-react';
import { format } from 'date-fns';
import { getPastMeetings } from '../data/mockMeetings';
import { getRecapByMeetingId } from '../data/mockRecaps';
import ProductBadge from '../components/shared/ProductBadge';

export default function MeetingHistory() {
  const navigate = useNavigate();
  const past = getPastMeetings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Post-Meeting</h1>
          <p className="page-subtitle">Review past meetings, complete recaps, and manage follow-ups</p>
        </div>
        <button onClick={() => navigate('/sales-companion/post-meeting/recap')} className="btn-primary self-start sm:self-auto shrink-0">
          <Mic size={14} />
          Record New Recap
        </button>
      </div>

      {/* Pending actions banner */}
      {past.some(m => !m.hasRecap || !m.hasCRMEntry || !m.hasFollowupEmail) && (
        <div className="bg-compliance-pv-flag-bg border border-compliance-pv-flag/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={15} className="text-compliance-pv-flag" />
            <p className="text-sm font-semibold text-compliance-pv-flag">Pending Actions Required</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {past.filter(m => !m.hasRecap).map(m => (
              <button
                key={m.id}
                onClick={() => navigate('/sales-companion/post-meeting/recap')}
                className="text-xs bg-white border border-compliance-pv-flag/30 text-compliance-pv-flag rounded-lg px-2.5 py-1.5 hover:bg-amber-50 transition-colors"
              >
                Recap needed: {m.hcp.name}
              </button>
            ))}
            {past.filter(m => m.hasRecap && !m.hasCRMEntry).map(m => (
              <button
                key={m.id}
                onClick={() => navigate('/sales-companion/post-meeting/structured-recap')}
                className="text-xs bg-white border border-compliance-pv-flag/30 text-compliance-pv-flag rounded-lg px-2.5 py-1.5 hover:bg-amber-50 transition-colors"
              >
                CRM pending: {m.hcp.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Meeting list */}
      <div className="card divide-y divide-merz-border">
        {past.map(meeting => {
          const recap = getRecapByMeetingId(meeting.id);
          return (
            <div
              key={meeting.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => meeting.hasRecap
                ? navigate('/sales-companion/post-meeting/structured-recap')
                : navigate('/sales-companion/post-meeting/recap')
              }
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex flex-col items-center justify-center shrink-0">
                  <p className="text-[10px] text-gray-500 uppercase leading-none">{format(new Date(meeting.date), 'MMM')}</p>
                  <p className="text-sm font-bold text-gray-600 leading-none">{format(new Date(meeting.date), 'd')}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm text-merz-slate">{meeting.hcp.name}</p>
                      <p className="text-xs text-merz-slate-light">{meeting.hcp.specialty} · {meeting.location}</p>
                    </div>
                    <ChevronRight size={15} className="text-merz-slate-light shrink-0 ml-2" />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {meeting.products.map(p => <ProductBadge key={p} product={p} size="sm" />)}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`badge text-[10px] flex items-center gap-1 ${meeting.hasRecap ? 'badge-green' : 'badge-red'}`}>
                      {meeting.hasRecap ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                      {meeting.hasRecap ? 'Recap Complete' : 'Recap Needed'}
                    </span>
                    <span className={`badge text-[10px] flex items-center gap-1 ${meeting.hasCRMEntry ? 'badge-green' : 'badge-amber'}`}>
                      {meeting.hasCRMEntry ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                      {meeting.hasCRMEntry ? 'CRM Entry Done' : 'CRM Pending'}
                    </span>
                    <span className={`badge text-[10px] flex items-center gap-1 ${meeting.hasFollowupEmail ? 'badge-green' : 'badge-gray'}`}>
                      {meeting.hasFollowupEmail ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                      {meeting.hasFollowupEmail ? 'Email Sent' : 'Email Pending'}
                    </span>
                  </div>
                  {recap && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-2 border border-merz-border">
                      <p className="text-[11px] text-merz-slate line-clamp-2">{recap.sentimentNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
