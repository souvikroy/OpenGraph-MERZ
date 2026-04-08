import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Brain, Mic, Shield, Check } from 'lucide-react';
import { mockCurrentUser } from '../data/mockUser';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    recapReminderHours: 2,
    quizFrequency: 'before-meetings',
    emailReminderInterval: 24,
    crmReminderHours: 24,
    pvAlertEmail: 'james.mitchell@merz.ae',
    offLabelNotifications: true,
    weeklyReportEmail: true,
    pushNotifications: true,
  });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <SettingsIcon size={20} className="text-merz-teal" />
          Settings
        </h1>
        <p className="page-subtitle">Notification preferences, reminder timing, and platform configuration</p>
      </div>

      {/* User profile */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Brain size={15} className="text-merz-teal" />
          <p className="section-header">User Profile</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Name', value: mockCurrentUser.name },
            { label: 'Email', value: mockCurrentUser.email },
            { label: 'Role', value: mockCurrentUser.role.charAt(0).toUpperCase() + mockCurrentUser.role.slice(1) },
            { label: 'Territory', value: `${mockCurrentUser.territory}, ${mockCurrentUser.market}` },
          ].map(f => (
            <div key={f.label}>
              <label className="form-label">{f.label}</label>
              <div className="form-input bg-gray-50 text-merz-slate-mid cursor-not-allowed">{f.value}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-merz-slate-light mt-3">Profile managed by AllysAI admin. Contact support to update.</p>
      </div>

      {/* Notifications */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={15} className="text-merz-teal" />
          <p className="section-header">Notification Settings</p>
        </div>

        {[
          { key: 'pushNotifications', label: 'Push Notifications', desc: 'In-app notifications for meetings, recaps, and alerts' },
          { key: 'offLabelNotifications', label: 'Off-Label Query Alerts', desc: 'Notify me when a query is flagged as off-label' },
          { key: 'weeklyReportEmail', label: 'Weekly Report Email', desc: 'Receive weekly sales activity and training score emails' },
        ].map(opt => (
          <div key={opt.key} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-merz-slate">{opt.label}</p>
              <p className="text-xs text-merz-slate-light">{opt.desc}</p>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, [opt.key]: !(s as any)[opt.key] }))}
              className={`relative w-10 h-5.5 h-[22px] rounded-full transition-all ${
                (settings as any)[opt.key] ? 'bg-merz-teal' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                (settings as any)[opt.key] ? 'left-5' : 'left-0.5'
              }`} />
            </button>
          </div>
        ))}
      </div>

      {/* Recap reminders */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Mic size={15} className="text-merz-teal" />
          <p className="section-header">Recap & CRM Reminders</p>
        </div>
        <div>
          <label className="form-label">Recap Reminder — Hours after meeting</label>
          <select
            className="form-input"
            value={settings.recapReminderHours}
            onChange={e => setSettings(s => ({ ...s, recapReminderHours: +e.target.value }))}
          >
            {[1, 2, 4, 8, 24].map(h => (
              <option key={h} value={h}>{h === 24 ? 'Same day' : `${h} hour${h > 1 ? 's' : ''} after meeting`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">CRM Entry Reminder — Hours after recap</label>
          <select
            className="form-input"
            value={settings.crmReminderHours}
            onChange={e => setSettings(s => ({ ...s, crmReminderHours: +e.target.value }))}
          >
            {[2, 4, 8, 24, 48].map(h => (
              <option key={h} value={h}>{`${h} hours`}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Follow-up Email Reminder — Hours after recap</label>
          <select
            className="form-input"
            value={settings.emailReminderInterval}
            onChange={e => setSettings(s => ({ ...s, emailReminderInterval: +e.target.value }))}
          >
            {[4, 8, 24, 48].map(h => (
              <option key={h} value={h}>{`${h} hours`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Training quiz */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Brain size={15} className="text-merz-teal" />
          <p className="section-header">Micro-Training Quiz Frequency</p>
        </div>
        <div>
          <label className="form-label">When to trigger quizzes</label>
          <select
            className="form-input"
            value={settings.quizFrequency}
            onChange={e => setSettings(s => ({ ...s, quizFrequency: e.target.value }))}
          >
            <option value="before-meetings">Before every meeting (product-specific)</option>
            <option value="daily">Once daily</option>
            <option value="3x-week">3× per week</option>
            <option value="weekly">Once per week</option>
          </select>
        </div>
      </div>

      {/* Compliance */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={15} className="text-merz-teal" />
          <p className="section-header">Compliance Configuration</p>
        </div>
        <div className="bg-merz-teal-light rounded-xl p-4">
          <p className="text-sm font-semibold text-merz-teal mb-1">Compliance guardrails are always active</p>
          <p className="text-xs text-merz-teal-dark">
            Off-label detection, PV signal flagging, and controlled vocabulary enforcement cannot be disabled by individual users. These are managed at the platform level by the Compliance team.
          </p>
        </div>
        <div className="mt-3">
          <label className="form-label">PV Alert Contact Email</label>
          <input
            type="email"
            className="form-input"
            value={settings.pvAlertEmail}
            onChange={e => setSettings(s => ({ ...s, pvAlertEmail: e.target.value }))}
          />
          <p className="text-xs text-merz-slate-light mt-1">All PV alerts are also sent automatically to the PV team (Fouad).</p>
        </div>
      </div>

      <button onClick={save} className="w-full btn-primary justify-center py-3">
        {saved ? <><Check size={15} /> Settings Saved!</> : 'Save Settings'}
      </button>
    </div>
  );
}
