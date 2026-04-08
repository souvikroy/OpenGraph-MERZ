import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Calendar,
  Mic,
  BarChart2,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Brain,
  Users,
  GraduationCap,
} from 'lucide-react';
import { getUnreadCount } from '../../data/mockNotifications';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Product Expert',
    icon: <Brain size={18} />,
    path: '/product-expert',
    children: [
      { label: 'Chat', path: '/product-expert/chat' },
      { label: 'Audit Trail', path: '/product-expert/audit' },
    ],
  },
  {
    label: 'Pre-Meeting',
    icon: <Calendar size={18} />,
    path: '/sales-companion/pre-meeting',
    children: [
      { label: 'Meetings', path: '/sales-companion/pre-meeting/meetings' },
      { label: 'Training Quiz', path: '/sales-companion/pre-meeting/quiz' },
      { label: 'Scorecards', path: '/sales-companion/pre-meeting/scorecards' },
    ],
  },
  {
    label: 'Post-Meeting',
    icon: <Mic size={18} />,
    path: '/sales-companion/post-meeting',
    children: [
      { label: 'Voice Recap', path: '/sales-companion/post-meeting/recap' },
      { label: 'Past Meetings', path: '/sales-companion/post-meeting/history' },
    ],
  },
  {
    label: 'Reports',
    icon: <BarChart2 size={18} />,
    path: '/reports',
  },
  {
    label: 'HCP Directory',
    icon: <Users size={18} />,
    path: '/hcps',
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const unread = getUnreadCount();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-merz-border shadow-sidebar transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      } shrink-0 z-20`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-merz-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-merz-teal shrink-0">
          <Brain size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-merz-slate leading-tight">AllysAI</p>
            <p className="text-[10px] text-merz-slate-light font-medium tracking-wide uppercase">× Merz</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Dashboard"
        >
          <BarChart2 size={18} className="shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <div className={`${collapsed ? '' : 'pt-2 pb-1'}`}>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-merz-slate-light uppercase tracking-widest mb-1">
              Product Expert
            </p>
          )}
          {collapsed && <div className="h-px bg-merz-border mx-2 my-1" />}
        </div>

        <NavLink
          to="/product-expert/chat"
          className={({ isActive }) =>
            isActive ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="AI Chat"
        >
          <MessageSquare size={18} className="shrink-0" />
          {!collapsed && <span>AI Product Expert</span>}
        </NavLink>
        <NavLink
          to="/product-expert/audit"
          className={({ isActive }) =>
            isActive ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Audit Trail"
        >
          <GraduationCap size={18} className="shrink-0" />
          {!collapsed && <span>Audit Trail</span>}
        </NavLink>

        <div className={`${collapsed ? '' : 'pt-3 pb-1'}`}>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-merz-slate-light uppercase tracking-widest mb-1">
              Sales Companion
            </p>
          )}
          {collapsed && <div className="h-px bg-merz-border mx-2 my-1" />}
        </div>

        <NavLink
          to="/sales-companion/pre-meeting/meetings"
          className={() =>
            isActive('/sales-companion/pre-meeting') ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Pre-Meeting"
        >
          <Calendar size={18} className="shrink-0" />
          {!collapsed && <span>Pre-Meeting</span>}
        </NavLink>
        <NavLink
          to="/sales-companion/post-meeting/recap"
          className={() =>
            isActive('/sales-companion/post-meeting') ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Post-Meeting"
        >
          <Mic size={18} className="shrink-0" />
          {!collapsed && <span>Post-Meeting</span>}
        </NavLink>

        <div className={`${collapsed ? '' : 'pt-3 pb-1'}`}>
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-merz-slate-light uppercase tracking-widest mb-1">
              Analytics
            </p>
          )}
          {collapsed && <div className="h-px bg-merz-border mx-2 my-1" />}
        </div>

        <NavLink
          to="/reports"
          className={() =>
            isActive('/reports') ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Reports"
        >
          <BarChart2 size={18} className="shrink-0" />
          {!collapsed && <span>Reports & Analytics</span>}
        </NavLink>

        <div className={`${collapsed ? '' : 'pt-3 pb-1'}`}>
          {collapsed && <div className="h-px bg-merz-border mx-2 my-1" />}
        </div>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            isActive ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Notifications"
        >
          <div className="relative shrink-0">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </div>
          {!collapsed && (
            <span className="flex-1 flex items-center justify-between">
              Notifications
              {unread > 0 && (
                <span className="badge bg-red-100 text-red-600 text-[10px] px-1.5 py-0">
                  {unread}
                </span>
              )}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Settings"
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* Compliance badge */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-merz-border">
          <div className="bg-merz-teal-light rounded-lg px-3 py-2">
            <p className="text-[10px] font-bold text-merz-teal uppercase tracking-wide">Compliance Active</p>
            <p className="text-[10px] text-merz-teal-dark mt-0.5">Off-label & PV guardrails enabled</p>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-white border border-merz-border rounded-full flex items-center justify-center text-merz-slate-light hover:text-merz-slate hover:shadow-sm transition-all"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
