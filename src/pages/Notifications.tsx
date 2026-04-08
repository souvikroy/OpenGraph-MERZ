import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Mic, CheckCircle, AlertTriangle, BarChart2,
  BookOpen, Calendar, ChevronRight, Check,
} from 'lucide-react';
import { format } from 'date-fns';
import { mockNotifications } from '../data/mockNotifications';
import type { NotificationType, Notification } from '../types';

const typeConfig: Record<NotificationType, {
  icon: React.ReactNode;
  label: string;
  color: string;
}> = {
  'pending-recap': {
    icon: <Mic size={14} />,
    label: 'Pending Recap',
    color: 'bg-compliance-pv-flag-bg text-compliance-pv-flag',
  },
  'crm-entry': {
    icon: <CheckCircle size={14} />,
    label: 'CRM Entry',
    color: 'bg-compliance-pv-flag-bg text-compliance-pv-flag',
  },
  'follow-up-email': {
    icon: <ChevronRight size={14} />,
    label: 'Follow-up Email',
    color: 'bg-product-xeomin-light text-product-xeomin',
  },
  'training-quiz': {
    icon: <BookOpen size={14} />,
    label: 'Training Quiz',
    color: 'bg-product-belotero-light text-product-belotero',
  },
  'pv-alert': {
    icon: <AlertTriangle size={14} />,
    label: 'PV Alert',
    color: 'bg-compliance-off-label-bg text-compliance-off-label',
  },
  'report-ready': {
    icon: <BarChart2 size={14} />,
    label: 'Report Ready',
    color: 'bg-merz-teal-light text-merz-teal',
  },
  'meeting-reminder': {
    icon: <Calendar size={14} />,
    label: 'Meeting Reminder',
    color: 'bg-merz-teal-light text-merz-teal',
  },
};

const GROUP_LABELS: { key: NotificationType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending-recap', label: 'Recaps' },
  { key: 'crm-entry', label: 'CRM' },
  { key: 'follow-up-email', label: 'Emails' },
  { key: 'training-quiz', label: 'Training' },
  { key: 'pv-alert', label: 'PV Alerts' },
  { key: 'meeting-reminder', label: 'Meetings' },
];

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return format(new Date(ts), 'MMM d');
}

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const markRead = (id: string) => {
    setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  };

  const markAllRead = () => {
    setNotifications(n => n.map(notif => ({ ...notif, read: true })));
  };

  const filtered = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;
  const priorityGroups = {
    high: filtered.filter(n => n.priority === 'high'),
    medium: filtered.filter(n => n.priority === 'medium'),
    low: filtered.filter(n => n.priority === 'low'),
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Bell size={20} className="text-merz-teal" />
            Notifications
            {unreadCount > 0 && (
              <span className="badge bg-red-100 text-red-600 ml-1">{unreadCount} unread</span>
            )}
          </h1>
          <p className="page-subtitle">Reminders, alerts, and action items</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost text-sm">
            <Check size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {GROUP_LABELS.map(g => {
          const count = g.key === 'all'
            ? notifications.filter(n => !n.read).length
            : notifications.filter(n => n.type === g.key && !n.read).length;
          return (
            <button
              key={g.key}
              onClick={() => setFilter(g.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === g.key
                  ? 'bg-merz-teal text-white'
                  : 'bg-white border border-merz-border text-merz-slate-mid hover:bg-gray-50'
              }`}
            >
              {g.label}
              {count > 0 && (
                <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  filter === g.key ? 'bg-white/30 text-white' : 'bg-red-100 text-red-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification groups by priority */}
      {(['high', 'medium', 'low'] as const).map(priority => {
        const items = priorityGroups[priority];
        if (items.length === 0) return null;
        const labels = { high: 'Urgent', medium: 'Important', low: 'Informational' };
        return (
          <div key={priority}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-bold uppercase tracking-wide ${
                priority === 'high' ? 'text-compliance-off-label' :
                priority === 'medium' ? 'text-compliance-pv-flag' : 'text-merz-slate-light'
              }`}>
                {labels[priority]}
              </span>
              <div className="flex-1 h-px bg-merz-border" />
            </div>
            <div className="card divide-y divide-merz-border">
              {items.map((notif: Notification) => {
                const config = typeConfig[notif.type];
                return (
                  <div
                    key={notif.id}
                    className={`p-4 transition-colors ${notif.read ? 'opacity-60' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-merz-slate">{notif.title}</p>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-merz-teal shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-merz-slate-light shrink-0">{timeAgo(notif.timestamp)}</span>
                        </div>
                        <p className="text-xs text-merz-slate-mid mt-0.5 leading-relaxed">{notif.message}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-2.5">
                          {notif.actionLabel && notif.actionPath && (
                            <button
                              onClick={() => {
                                markRead(notif.id);
                                navigate(notif.actionPath!);
                              }}
                              className="btn-primary text-xs px-3 py-1.5"
                            >
                              {notif.actionLabel}
                              <ChevronRight size={12} />
                            </button>
                          )}
                          {!notif.read && (
                            <button
                              onClick={() => markRead(notif.id)}
                              className="btn-ghost text-xs px-2 py-1.5"
                            >
                              <Check size={12} />
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Bell size={24} className="text-gray-400" />
          </div>
          <p className="font-semibold text-merz-slate">All caught up!</p>
          <p className="text-sm text-merz-slate-light mt-1">No notifications in this category</p>
        </div>
      )}
    </div>
  );
}
