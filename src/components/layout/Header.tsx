import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, ChevronRight, Home } from 'lucide-react';
import { mockCurrentUser } from '../../data/mockUser';
import { getUnreadCount } from '../../data/mockNotifications';

const routeLabels: Record<string, string> = {
  '': 'Dashboard',
  'product-expert': 'Product Expert',
  'chat': 'AI Chat',
  'audit': 'Audit Trail',
  'sales-companion': 'Sales Companion',
  'pre-meeting': 'Pre-Meeting',
  'meetings': 'Meetings',
  'quiz': 'Micro-Training Quiz',
  'scorecards': 'Training Scorecards',
  'post-meeting': 'Post-Meeting',
  'recap': 'Voice Recap',
  'history': 'Meeting History',
  'reports': 'Reports & Analytics',
  'sales-activity': 'Sales Activity',
  'competitive': 'Competitive Intelligence',
  'compliance': 'Compliance & Audit',
  'adoption': 'Platform Adoption',
  'notifications': 'Notifications',
  'settings': 'Settings',
  'hcps': 'HCP Directory',
};

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const unread = getUnreadCount();

  const crumbs = location.pathname.split('/').filter(Boolean);

  return (
    <header className="h-14 bg-white border-b border-merz-border flex items-center px-4 gap-4 shrink-0 z-10">
      {/* Breadcrumbs */}
      <nav className="flex-1 flex items-center gap-1.5 text-sm overflow-hidden">
        <button
          onClick={() => navigate('/')}
          className="text-merz-slate-light hover:text-merz-teal transition-colors shrink-0"
        >
          <Home size={14} />
        </button>
        {crumbs.map((segment, i) => {
          const path = '/' + crumbs.slice(0, i + 1).join('/');
          const label = routeLabels[segment] || segment;
          const isLast = i === crumbs.length - 1;
          return (
            <span key={path} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight size={12} className="text-merz-border shrink-0" />
              {isLast ? (
                <span className="font-semibold text-merz-slate truncate">{label}</span>
              ) : (
                <button
                  onClick={() => navigate(path)}
                  className="text-merz-slate-light hover:text-merz-teal transition-colors truncate"
                >
                  {label}
                </button>
              )}
            </span>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-merz-slate-mid hover:bg-gray-100 transition-colors"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* User chip */}
        <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-merz-border hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-merz-teal flex items-center justify-center text-white text-xs font-bold">
            {mockCurrentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-merz-slate leading-tight">{mockCurrentUser.name}</p>
            <p className="text-[10px] text-merz-slate-light leading-tight capitalize">{mockCurrentUser.role} · {mockCurrentUser.territory}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate('/login')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-merz-slate-light hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
