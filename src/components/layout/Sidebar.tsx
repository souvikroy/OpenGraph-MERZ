import { useState, useEffect } from 'react';
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
  GraduationCap,
  X,
} from 'lucide-react';
import { getUnreadCount } from '../../data/mockNotifications';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const unread = getUnreadCount();

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Close mobile drawer on navigation
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-merz-border shadow-sidebar
        transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-20 md:shrink-0
        w-60 ${collapsed ? 'md:w-16' : 'md:w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-merz-border ${collapsed ? 'md:justify-center' : ''}`}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-merz-teal shrink-0">
          <Brain size={16} className="text-white" />
        </div>
        <div className={collapsed ? 'md:hidden' : ''}>
          <p className="text-sm font-bold text-merz-slate leading-tight">AllysAI</p>
          <p className="text-[10px] text-merz-slate-light font-medium tracking-wide uppercase">× Merz</p>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="ml-auto md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-merz-slate-light hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>
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
          <span className={collapsed ? 'md:hidden' : ''}>Dashboard</span>
        </NavLink>

        <div className={`${collapsed ? 'md:hidden' : 'pt-2 pb-1'}`}>
          <p className={`px-3 text-[10px] font-bold text-merz-slate-light uppercase tracking-widest mb-1 ${collapsed ? 'hidden' : ''}`}>
            Product Expert
          </p>
          <div className={`h-px bg-merz-border mx-2 my-1 ${collapsed ? 'md:block hidden' : 'hidden'}`} />
        </div>

        <NavLink
          to="/product-expert/chat"
          className={({ isActive }) =>
            isActive ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="AI Chat"
        >
          <MessageSquare size={18} className="shrink-0" />
          <span className={collapsed ? 'md:hidden' : ''}>AI Product Expert</span>
        </NavLink>
        <NavLink
          to="/product-expert/audit"
          className={({ isActive }) =>
            isActive ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Audit Trail"
        >
          <GraduationCap size={18} className="shrink-0" />
          <span className={collapsed ? 'md:hidden' : ''}>Audit Trail</span>
        </NavLink>

        <div className={`${collapsed ? 'md:hidden' : 'pt-3 pb-1'}`}>
          <p className={`px-3 text-[10px] font-bold text-merz-slate-light uppercase tracking-widest mb-1 ${collapsed ? 'hidden' : ''}`}>
            Sales Companion
          </p>
          <div className={`h-px bg-merz-border mx-2 my-1 ${collapsed ? 'md:block hidden' : 'hidden'}`} />
        </div>

        <NavLink
          to="/sales-companion/pre-meeting/meetings"
          className={() =>
            isActive('/sales-companion/pre-meeting') ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Pre-Meeting"
        >
          <Calendar size={18} className="shrink-0" />
          <span className={collapsed ? 'md:hidden' : ''}>Pre-Meeting</span>
        </NavLink>
        <NavLink
          to="/sales-companion/post-meeting/recap"
          className={() =>
            isActive('/sales-companion/post-meeting') ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Post-Meeting"
        >
          <Mic size={18} className="shrink-0" />
          <span className={collapsed ? 'md:hidden' : ''}>Post-Meeting</span>
        </NavLink>

        <div className={`${collapsed ? 'md:hidden' : 'pt-3 pb-1'}`}>
          <p className={`px-3 text-[10px] font-bold text-merz-slate-light uppercase tracking-widest mb-1 ${collapsed ? 'hidden' : ''}`}>
            Analytics
          </p>
          <div className={`h-px bg-merz-border mx-2 my-1 ${collapsed ? 'md:block hidden' : 'hidden'}`} />
        </div>

        <NavLink
          to="/reports"
          className={() =>
            isActive('/reports') ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Reports"
        >
          <BarChart2 size={18} className="shrink-0" />
          <span className={collapsed ? 'md:hidden' : ''}>Reports & Analytics</span>
        </NavLink>

        <div className={collapsed ? 'md:hidden' : 'pt-3 pb-1'}>
          <div className={`h-px bg-merz-border mx-2 my-1 ${collapsed ? 'md:block hidden' : 'hidden'}`} />
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
          <span className={`flex-1 flex items-center justify-between ${collapsed ? 'md:hidden' : ''}`}>
            Notifications
            {unread > 0 && (
              <span className="badge bg-red-100 text-red-600 text-[10px] px-1.5 py-0">
                {unread}
              </span>
            )}
          </span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? 'nav-item-active' : 'nav-item-inactive'
          }
          title="Settings"
        >
          <Settings size={18} className="shrink-0" />
          <span className={collapsed ? 'md:hidden' : ''}>Settings</span>
        </NavLink>
      </nav>

      {/* Compliance badge */}
      <div className={`px-3 py-3 border-t border-merz-border ${collapsed ? 'md:hidden' : ''}`}>
        <div className="bg-merz-teal-light rounded-lg px-3 py-2">
          <p className="text-[10px] font-bold text-merz-teal uppercase tracking-wide">Compliance Active</p>
          <p className="text-[10px] text-merz-teal-dark mt-0.5">Off-label & PV guardrails enabled</p>
        </div>
      </div>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex absolute -right-3 top-16 w-6 h-6 bg-white border border-merz-border rounded-full items-center justify-center text-merz-slate-light hover:text-merz-slate hover:shadow-sm transition-all"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
