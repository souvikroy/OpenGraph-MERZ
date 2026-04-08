import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MessageSquare,
  Mic,
  Bell,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Brain,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import { getUpcomingMeetings } from '../data/mockMeetings';
import { getUnreadNotifications } from '../data/mockNotifications';
import { mockCurrentUser } from '../data/mockUser';
import { mockTrainingScores } from '../data/mockQuizzes';
import { mockChatSessions } from '../data/mockChats';
import StatCard from '../components/shared/StatCard';
import ProductBadge from '../components/shared/ProductBadge';
import ComplianceBadge from '../components/shared/ComplianceBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  const upcomingMeetings = getUpcomingMeetings().slice(0, 3);
  const notifications = getUnreadNotifications().slice(0, 4);
  const myScores = mockTrainingScores.find(s => s.repId === mockCurrentUser.id);
  const recentChats = mockChatSessions.slice(0, 3);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="page-title">{greeting}, {mockCurrentUser.name.split(' ')[0]}</h1>
          <p className="page-subtitle">
            {format(now, 'EEEE, d MMMM yyyy')} · {mockCurrentUser.territory}, {mockCurrentUser.market}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => navigate('/product-expert/chat')} className="btn-primary">
            <MessageSquare size={15} />
            <span className="hidden sm:inline">Ask Product Expert</span>
            <span className="sm:hidden">Ask AI</span>
          </button>
          <button onClick={() => navigate('/sales-companion/pre-meeting/meetings')} className="btn-secondary">
            <Calendar size={15} />
            <span className="hidden sm:inline">Today's Meetings</span>
            <span className="sm:hidden">Meetings</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Meetings Today"
          value={upcomingMeetings.filter(m => m.date === format(now, 'yyyy-MM-dd')).length}
          subtitle="Upcoming"
          icon={<Calendar size={16} />}
          color="teal"
          trend={{ value: '+1 vs last week', direction: 'up' }}
        />
        <StatCard
          title="Pending Recaps"
          value="2"
          subtitle="Require completion"
          icon={<Mic size={16} />}
          color="amber"
          trend={{ value: 'Action needed', direction: 'flat' }}
        />
        <StatCard
          title="Xeomin Score"
          value={`${myScores?.scores.Xeomin ?? 0}%`}
          subtitle="Latest training score"
          icon={<BookOpen size={16} />}
          color="blue"
          trend={{ value: '+3% vs last', direction: 'up' }}
        />
        <StatCard
          title="Queries This Week"
          value={recentChats.length}
          subtitle="Product Expert sessions"
          icon={<Brain size={16} />}
          color="teal"
          trend={{ value: 'Active usage', direction: 'up' }}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <div className="lg:col-span-2 card">
          <div className="p-4 border-b border-merz-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-merz-teal" />
              <span className="section-header">Upcoming Meetings</span>
            </div>
            <button
              onClick={() => navigate('/sales-companion/pre-meeting/meetings')}
              className="text-xs text-merz-teal hover:text-merz-teal-dark font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-merz-border">
            {upcomingMeetings.map(meeting => (
              <div
                key={meeting.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/sales-companion/pre-meeting/${meeting.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-merz-teal-light flex flex-col items-center justify-center shrink-0">
                    <p className="text-[10px] font-bold text-merz-teal uppercase leading-none">
                      {format(new Date(meeting.date), 'MMM')}
                    </p>
                    <p className="text-sm font-bold text-merz-teal leading-none">
                      {format(new Date(meeting.date), 'd')}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-merz-slate truncate">{meeting.hcp.name}</p>
                      <span className={`badge text-[10px] px-1.5 py-0 ${
                        meeting.prepStatus === 'complete'
                          ? 'badge-green'
                          : meeting.prepStatus === 'in-progress'
                          ? 'badge-amber'
                          : 'badge-gray'
                      }`}>
                        {meeting.prepStatus === 'complete' ? 'Ready' : meeting.prepStatus === 'in-progress' ? 'In Progress' : 'Not Started'}
                      </span>
                    </div>
                    <p className="text-xs text-merz-slate-light">{meeting.time} · {meeting.location}</p>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {meeting.products.map(p => (
                        <ProductBadge key={p} product={p} size="sm" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-merz-slate-light shrink-0">{meeting.hcp.tier}</div>
                </div>
              </div>
            ))}
          </div>
          {upcomingMeetings.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-merz-slate-light">No upcoming meetings</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Notifications */}
          <div className="card">
            <div className="p-4 border-b border-merz-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-merz-teal" />
                <span className="section-header">Notifications</span>
                {notifications.length > 0 && (
                  <span className="badge bg-red-100 text-red-600 text-[10px] px-1.5 py-0">{notifications.length}</span>
                )}
              </div>
              <button
                onClick={() => navigate('/notifications')}
                className="text-xs text-merz-teal hover:text-merz-teal-dark font-medium flex items-center gap-1"
              >
                All <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-merz-border">
              {notifications.slice(0, 3).map(notif => (
                <div
                  key={notif.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => notif.actionPath && navigate(notif.actionPath)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.priority === 'high' ? 'bg-red-50 text-red-500' :
                      notif.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {notif.type === 'pv-alert' ? <AlertTriangle size={13} /> :
                       notif.type === 'pending-recap' ? <Mic size={13} /> :
                       notif.type === 'crm-entry' ? <CheckCircle size={13} /> :
                       <Clock size={13} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-merz-slate">{notif.title}</p>
                      <p className="text-[11px] text-merz-slate-light leading-relaxed mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training Scores */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-merz-teal" />
              <span className="section-header">Training Scores</span>
            </div>
            {myScores && (
              <div className="space-y-2.5">
                {(Object.entries(myScores.scores) as [string, number][]).map(([product, score]) => (
                  <div key={product}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-merz-slate-mid">{product}</span>
                      <span className={`text-xs font-bold ${
                        score >= 85 ? 'text-compliance-compliant' :
                        score >= 70 ? 'text-merz-teal' : 'text-compliance-off-label'
                      }`}>{score}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          score >= 85 ? 'bg-compliance-compliant' :
                          score >= 70 ? 'bg-merz-teal' : 'bg-compliance-off-label'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Product Expert Queries */}
      <div className="card">
        <div className="p-4 border-b border-merz-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-merz-teal" />
            <span className="section-header">Recent Product Expert Queries</span>
          </div>
          <button
            onClick={() => navigate('/product-expert/audit')}
            className="text-xs text-merz-teal hover:text-merz-teal-dark font-medium flex items-center gap-1"
          >
            Full Audit Trail <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-merz-border bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Time</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Query</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-merz-border">
              {recentChats.map(session => {
                const userMsg = session.messages.find(m => m.role === 'user');
                const aiMsg = session.messages.find(m => m.role === 'assistant');
                if (!userMsg || !aiMsg) return null;
                return (
                  <tr
                    key={session.id}
                    className="table-row-hover"
                    onClick={() => navigate('/product-expert/audit')}
                  >
                    <td className="px-4 py-3 text-xs text-merz-slate-light whitespace-nowrap">
                      {format(new Date(session.startTime), 'MMM d, HH:mm')}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-merz-slate line-clamp-1">{userMsg.content}</p>
                    </td>
                    <td className="px-4 py-3">
                      {session.product && <ProductBadge product={session.product} size="sm" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {aiMsg.complianceFlags?.map(flag => (
                          <ComplianceBadge key={flag} flag={flag} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {aiMsg.confidenceScore !== undefined && (
                        <span className={`text-xs font-semibold ${
                          aiMsg.confidenceScore >= 90 ? 'text-compliance-compliant' :
                          aiMsg.confidenceScore >= 75 ? 'text-merz-teal' : 'text-compliance-pv-flag'
                        }`}>
                          {aiMsg.confidenceScore}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
