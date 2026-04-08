import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronRight, CheckCircle, AlertCircle, Brain, BookOpen } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { getUpcomingMeetings, getPastMeetings } from '../data/mockMeetings';
import type { PrepStatus } from '../types';
import ProductBadge from '../components/shared/ProductBadge';

const prepConfig: Record<PrepStatus, { label: string; className: string; icon: React.ReactNode }> = {
  'complete': {
    label: 'Ready',
    className: 'badge-green',
    icon: <CheckCircle size={10} />,
  },
  'in-progress': {
    label: 'In Progress',
    className: 'badge-amber',
    icon: <AlertCircle size={10} />,
  },
  'not-started': {
    label: 'Prep Needed',
    className: 'badge-gray',
    icon: <AlertCircle size={10} />,
  },
};

function getMeetingDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  if (isToday(date)) return { label: 'Today', highlight: true };
  if (isTomorrow(date)) return { label: 'Tomorrow', highlight: false };
  return { label: format(date, 'EEEE, d MMM'), highlight: false };
}

export default function MeetingSchedule() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const upcoming = getUpcomingMeetings();
  const past = getPastMeetings();

  // Group upcoming meetings by date
  const grouped = upcoming.reduce<Record<string, typeof upcoming>>((acc, m) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Calendar size={20} className="text-merz-teal" />
            Meetings
          </h1>
          <p className="page-subtitle">View upcoming visits and access pre-meeting preparation</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/sales-companion/pre-meeting/quiz')}
            className="btn-secondary"
          >
            <BookOpen size={14} />
            Start Quiz
          </button>
          <button
            onClick={() => navigate('/sales-companion/pre-meeting/scorecards')}
            className="btn-ghost"
          >
            View Scorecards
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Upcoming</p>
          <p className="text-2xl font-bold text-merz-slate mt-1">{upcoming.length}</p>
          <p className="text-xs text-merz-slate-light">meetings this week</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Ready to Go</p>
          <p className="text-2xl font-bold text-compliance-compliant mt-1">
            {upcoming.filter(m => m.prepStatus === 'complete').length}
          </p>
          <p className="text-xs text-merz-slate-light">prep complete</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Prep Needed</p>
          <p className="text-2xl font-bold text-compliance-pv-flag mt-1">
            {upcoming.filter(m => m.prepStatus !== 'complete').length}
          </p>
          <p className="text-xs text-merz-slate-light">need preparation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-merz-border gap-4">
        {[
          { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
          { key: 'past', label: `Past (${past.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? 'text-merz-teal border-merz-teal'
                : 'text-merz-slate-light border-transparent hover:text-merz-slate'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'upcoming' ? (
        <div className="space-y-6">
          {Object.entries(grouped).sort().map(([date, meetings]) => {
            const { label, highlight } = getMeetingDateLabel(date);
            return (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-sm font-bold ${highlight ? 'text-merz-teal' : 'text-merz-slate'}`}>
                    {label}
                  </span>
                  {highlight && (
                    <span className="badge-teal text-[10px]">Today</span>
                  )}
                  <div className="flex-1 h-px bg-merz-border" />
                  <span className="text-xs text-merz-slate-light">{meetings.length} meeting{meetings.length > 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-3">
                  {meetings.map(meeting => {
                    const prep = prepConfig[meeting.prepStatus];
                    return (
                      <div
                        key={meeting.id}
                        className="card-hover p-4 cursor-pointer"
                        onClick={() => navigate(`/sales-companion/pre-meeting/${meeting.id}`)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Time column */}
                          <div className="w-16 shrink-0 text-center">
                            <p className="text-lg font-bold text-merz-teal">{meeting.time}</p>
                            <p className="text-[10px] text-merz-slate-light">{meeting.duration}min</p>
                          </div>

                          {/* Divider */}
                          <div className="w-px bg-merz-border self-stretch" />

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-merz-slate">{meeting.hcp.name}</h3>
                                <p className="text-xs text-merz-slate-light">{meeting.hcp.specialty} · {meeting.hcp.tier}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`${prep.className} flex items-center gap-1`}>
                                  {prep.icon}
                                  {prep.label}
                                </span>
                                <ChevronRight size={15} className="text-merz-slate-light" />
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mt-2 text-xs text-merz-slate-light">
                              <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                {meeting.location}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {meeting.products.map(p => (
                                <ProductBadge key={p} product={p} size="sm" />
                              ))}
                            </div>

                            {meeting.objectives.length > 0 && (
                              <div className="mt-2.5 bg-gray-50 rounded-lg p-2.5">
                                <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1">Objectives</p>
                                <ul className="space-y-0.5">
                                  {meeting.objectives.slice(0, 2).map((obj, i) => (
                                    <li key={i} className="text-[11px] text-merz-slate flex items-start gap-1.5">
                                      <span className="text-merz-teal mt-0.5">•</span>
                                      {obj}
                                    </li>
                                  ))}
                                  {meeting.objectives.length > 2 && (
                                    <li className="text-[11px] text-merz-slate-light">+{meeting.objectives.length - 2} more</li>
                                  )}
                                </ul>
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
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {past.map(meeting => (
            <div
              key={meeting.id}
              className="card-hover p-4"
              onClick={() => navigate(`/sales-companion/post-meeting/${meeting.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex flex-col items-center justify-center shrink-0">
                  <p className="text-[10px] text-gray-500 uppercase leading-none">{format(new Date(meeting.date), 'MMM')}</p>
                  <p className="text-sm font-bold text-gray-600 leading-none">{format(new Date(meeting.date), 'd')}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-merz-slate">{meeting.hcp.name}</p>
                    <div className="flex gap-1">
                      {meeting.products.map(p => <ProductBadge key={p} product={p} size="sm" />)}
                    </div>
                  </div>
                  <p className="text-xs text-merz-slate-light mt-0.5">{meeting.location}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`badge text-[10px] ${meeting.hasRecap ? 'badge-green' : 'badge-red'}`}>
                    {meeting.hasRecap ? 'Recap Done' : 'No Recap'}
                  </span>
                  <span className={`badge text-[10px] ${meeting.hasCRMEntry ? 'badge-green' : 'badge-amber'}`}>
                    {meeting.hasCRMEntry ? 'CRM ✓' : 'CRM Pending'}
                  </span>
                  <ChevronRight size={15} className="text-merz-slate-light" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
