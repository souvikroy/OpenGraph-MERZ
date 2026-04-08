import { useState } from 'react';
import { BarChart2, Download, AlertTriangle, CheckCircle, TrendingUp, Users, BookOpen, Shield } from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import {
  mockReportCards,
  mockSalesActivityData,
  mockCompetitiveData,
  mockComplianceData,
  mockAdoptionData,
} from '../data/mockReports';
import ProductBadge from '../components/shared/ProductBadge';
import type { ProductBrand } from '../types';

const PRODUCT_COLORS: Record<ProductBrand, string> = {
  Xeomin: '#3B82F6',
  Belotero: '#8B5CF6',
  Radiesse: '#F97316',
  Ultherapy: '#0097A9',
};

type ReportTab = 'overview' | 'sales' | 'competitive' | 'compliance' | 'adoption';

const tabs: { key: ReportTab; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <BarChart2 size={14} /> },
  { key: 'sales', label: 'Sales Activity', icon: <TrendingUp size={14} /> },
  { key: 'competitive', label: 'Competitive Intel', icon: <Users size={14} /> },
  { key: 'compliance', label: 'Compliance & Audit', icon: <Shield size={14} /> },
  { key: 'adoption', label: 'Platform Adoption', icon: <BookOpen size={14} /> },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BarChart2 size={20} className="text-merz-teal" />
            Reports & Analytics
          </h1>
          <p className="page-subtitle">Automated reporting for sales, compliance, training, and platform adoption</p>
        </div>
        <button className="btn-secondary">
          <Download size={14} />
          Export All Reports
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-merz-border gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? 'text-merz-teal border-merz-teal'
                : 'text-merz-slate-light border-transparent hover:text-merz-slate'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockReportCards.map(report => (
              <div
                key={report.id}
                className="card-hover p-4 cursor-pointer"
                onClick={() => {
                  const tabMap: Record<string, ReportTab> = {
                    'sales-activity': 'sales', 'commercial-performance': 'sales',
                    'competitive-intelligence': 'competitive', 'off-label-query': 'compliance',
                    'pv-alerts': 'compliance', 'compliance-audit': 'compliance',
                    'platform-adoption': 'adoption', 'training-gap': 'adoption',
                    'hcp-engagement': 'sales', 'rep-performance': 'sales',
                  };
                  setActiveTab(tabMap[report.type] || 'sales');
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`badge text-[10px] ${
                    report.status === 'ready' ? 'badge-green' :
                    report.status === 'generating' ? 'badge-amber' : 'badge-gray'
                  }`}>
                    {report.status === 'ready' ? <CheckCircle size={9} /> : null}
                    {report.status}
                  </span>
                  <span className="badge-gray text-[10px]">{report.cadence}</span>
                </div>
                <p className="font-semibold text-sm text-merz-slate mb-1">{report.title}</p>
                <p className="text-xs text-merz-slate-light mb-3 line-clamp-2">{report.description}</p>
                <div className="flex items-center justify-between text-[10px] text-merz-slate-light">
                  <span>{report.recipients.length} recipients</span>
                  <span>Last: {format(new Date(report.lastGenerated), 'MMM d')}</span>
                </div>
                <div className="flex items-center gap-1 mt-3 flex-wrap">
                  {report.recipients.slice(0, 2).map(r => (
                    <span key={r} className="badge-gray text-[10px] truncate max-w-32">{r}</span>
                  ))}
                  {report.recipients.length > 2 && (
                    <span className="text-[10px] text-merz-slate-light">+{report.recipients.length - 2}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Activity */}
      {activeTab === 'sales' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="section-header">{mockSalesActivityData.weekLabel}</p>
            <button className="btn-secondary text-xs">
              <Download size={12} /> Download PDF
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label: 'Total Visits', value: mockSalesActivityData.summary.totalVisits, sub: `/${mockSalesActivityData.summary.visitTarget} target` },
              { label: 'HCPs Visited', value: mockSalesActivityData.summary.uniqueHCPs, sub: 'unique' },
              { label: 'Tier 1 Coverage', value: mockSalesActivityData.summary.tier1Coverage, sub: '' },
              { label: 'Recap Rate', value: mockSalesActivityData.summary.recapCompletionRate, sub: '' },
              { label: 'CRM Entry Rate', value: mockSalesActivityData.summary.crmEntryRate, sub: '' },
            ].map(kpi => (
              <div key={kpi.label} className="stat-card">
                <p className="text-xs font-semibold text-merz-slate-light uppercase tracking-wide">{kpi.label}</p>
                <p className="text-xl font-bold text-merz-slate mt-1">{kpi.value}</p>
                {kpi.sub && <p className="text-xs text-merz-slate-light">{kpi.sub}</p>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Weekly trend */}
            <div className="card p-4">
              <p className="section-header mb-4">Visit Trend (5 weeks)</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockSalesActivityData.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#718096' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#718096' }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="visits" stroke="#0097A9" strokeWidth={2.5} dot={{ r: 4, fill: '#0097A9' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* By product */}
            <div className="card p-4">
              <p className="section-header mb-4">Product Mentions & Sentiment</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockSalesActivityData.byProduct} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#718096' }} />
                  <YAxis dataKey="product" type="category" tick={{ fontSize: 10, fill: '#718096' }} width={70} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="mentions" radius={4}>
                    {mockSalesActivityData.byProduct.map(entry => (
                      <Cell key={entry.product} fill={PRODUCT_COLORS[entry.product as ProductBrand]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rep table */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-merz-border">
              <p className="section-header">Rep Performance This Week</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-merz-border bg-gray-50">
                  {['Rep', 'Visits', 'Target', 'Attainment', 'HCPs', 'Recaps', 'CRM Entries'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-merz-border">
                {mockSalesActivityData.byRep.map(rep => {
                  const pct = Math.round((rep.visits / rep.target) * 100);
                  return (
                    <tr key={rep.name} className="table-row-hover">
                      <td className="px-4 py-3 font-medium text-merz-slate">{rep.name}</td>
                      <td className="px-4 py-3">{rep.visits}</td>
                      <td className="px-4 py-3 text-merz-slate-light">{rep.target}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 90 ? 'bg-compliance-compliant' : pct >= 70 ? 'bg-merz-teal' : 'bg-compliance-pv-flag'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${pct >= 90 ? 'text-compliance-compliant' : pct >= 70 ? 'text-merz-teal' : 'text-compliance-pv-flag'}`}>
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{rep.hcps}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-[10px] ${rep.recaps >= rep.visits ? 'badge-green' : 'badge-amber'}`}>
                          {rep.recaps}/{rep.visits}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-[10px] ${rep.crm >= rep.visits * 0.8 ? 'badge-green' : 'badge-red'}`}>
                          {rep.crm}/{rep.visits}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Competitive Intelligence */}
      {activeTab === 'competitive' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="section-header">{mockCompetitiveData.weekLabel} · {mockCompetitiveData.totalMentions} competitor mentions</p>
            <button className="btn-secondary text-xs"><Download size={12} /> Download</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Pie chart */}
            <div className="card p-4">
              <p className="section-header mb-4">Mentions by Competitor</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={mockCompetitiveData.byCompetitor}
                    dataKey="mentions"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {mockCompetitiveData.byCompetitor.map((_, i) => (
                      <Cell key={i} fill={['#3B82F6', '#8B5CF6', '#F97316', '#0097A9', '#DC2626'][i % 5]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Competitor breakdown */}
            <div className="card p-4">
              <p className="section-header mb-4">Competitor Detail</p>
              <div className="space-y-3">
                {mockCompetitiveData.byCompetitor.map(c => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div className="w-20 text-sm font-semibold text-merz-slate">{c.name}</div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-merz-teal"
                        style={{ width: `${(c.mentions / mockCompetitiveData.totalMentions) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-merz-slate w-5 text-right">{c.mentions}</span>
                    <div className="flex gap-1">
                      {c.products.map(p => <ProductBadge key={p} product={p as ProductBrand} size="sm" />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent mentions log */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-merz-border">
              <p className="section-header">Recent Competitive Mentions Log</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-merz-border">
                  {['Date', 'Rep', 'HCP', 'Competitor', 'Our Product', 'Context'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-merz-border">
                {mockCompetitiveData.recentMentions.map((m, i) => (
                  <tr key={i} className="table-row-hover">
                    <td className="px-4 py-3 text-xs text-merz-slate-light">{format(new Date(m.date), 'MMM d')}</td>
                    <td className="px-4 py-3 text-xs font-medium text-merz-slate">{m.rep}</td>
                    <td className="px-4 py-3 text-xs text-merz-slate">{m.hcp}</td>
                    <td className="px-4 py-3"><span className="badge-amber">{m.competitor}</span></td>
                    <td className="px-4 py-3"><ProductBadge product={m.product as ProductBrand} size="sm" /></td>
                    <td className="px-4 py-3 text-xs text-merz-slate-mid">{m.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance & Audit */}
      {activeTab === 'compliance' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="section-header">Period: {mockComplianceData.period}</p>
            <button className="btn-secondary text-xs"><Download size={12} /> Export Audit Log</button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Off-Label Queries', value: mockComplianceData.totalOffLabel, color: 'text-compliance-off-label', bg: 'bg-compliance-off-label-bg' },
              { label: 'Resolved', value: mockComplianceData.resolvedOffLabel, color: 'text-compliance-compliant', bg: 'bg-compliance-compliant-bg' },
              { label: 'PV Alerts', value: mockComplianceData.totalPVAlerts, color: 'text-compliance-pv-flag', bg: 'bg-compliance-pv-flag-bg' },
              { label: 'PV Resolved', value: mockComplianceData.resolvedPV, color: 'text-compliance-compliant', bg: 'bg-compliance-compliant-bg' },
            ].map(s => (
              <div key={s.label} className={`card p-4 ${s.bg}`}>
                <p className="text-xs font-semibold text-merz-slate-light uppercase tracking-wide">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Off-label log */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-merz-border flex items-center gap-2">
              <AlertTriangle size={15} className="text-compliance-off-label" />
              <span className="section-header">Off-Label Query Log</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-merz-border">
                  {['ID', 'Date', 'Rep', 'Product', 'Query Summary', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-merz-border">
                {mockComplianceData.offLabelQueries.map((q, i) => (
                  <tr key={i} className="table-row-hover">
                    <td className="px-4 py-3 text-xs font-mono text-merz-slate-light">{q.id}</td>
                    <td className="px-4 py-3 text-xs text-merz-slate-light">{format(new Date(q.date), 'MMM d')}</td>
                    <td className="px-4 py-3 text-xs font-medium text-merz-slate">{q.rep}</td>
                    <td className="px-4 py-3"><ProductBadge product={q.product as ProductBrand} size="sm" /></td>
                    <td className="px-4 py-3 text-xs text-merz-slate">{q.query}</td>
                    <td className="px-4 py-3"><span className="badge-amber text-[10px]">{q.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PV alerts */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-merz-border flex items-center gap-2">
              <AlertTriangle size={15} className="text-compliance-pv-flag" />
              <span className="section-header">Pharmacovigilance Alerts</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-merz-border">
                  {['ID', 'Date', 'Rep', 'Product', 'Event Description', 'Severity', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-merz-border">
                {mockComplianceData.pvAlerts.map((alert, i) => (
                  <tr key={i} className="table-row-hover">
                    <td className="px-4 py-3 text-xs font-mono text-merz-slate-light">{alert.id}</td>
                    <td className="px-4 py-3 text-xs text-merz-slate-light">{format(new Date(alert.date), 'MMM d')}</td>
                    <td className="px-4 py-3 text-xs font-medium text-merz-slate">{alert.rep}</td>
                    <td className="px-4 py-3"><ProductBadge product={alert.product as ProductBrand} size="sm" /></td>
                    <td className="px-4 py-3 text-xs text-merz-slate">{alert.event}</td>
                    <td className="px-4 py-3"><span className="badge-amber">{alert.severity}</span></td>
                    <td className="px-4 py-3">
                      <span className={`badge text-[10px] flex items-center gap-1 ${alert.acknowledged ? 'badge-green' : 'badge-red'}`}>
                        {alert.acknowledged ? <CheckCircle size={9} /> : null}
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Platform Adoption */}
      {activeTab === 'adoption' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="section-header">{mockAdoptionData.weekLabel}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Active Users', value: `${mockAdoptionData.activeUsers}/${mockAdoptionData.totalUsers}`, sub: 'This week' },
              { label: 'Adoption Rate', value: mockAdoptionData.adoptionRate, sub: 'Of pilot cohort' },
              { label: 'Recaps Completed', value: mockAdoptionData.recapStats.completed, sub: `/${mockAdoptionData.recapStats.total} total` },
              { label: 'CRM Entries', value: mockAdoptionData.recapStats.crmConfirmed, sub: 'Confirmed in OCE' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <p className="text-xs font-semibold text-merz-slate-light uppercase tracking-wide">{s.label}</p>
                <p className="text-2xl font-bold text-merz-slate mt-1">{s.value}</p>
                <p className="text-xs text-merz-slate-light">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Active users trend */}
            <div className="card p-4">
              <p className="section-header mb-4">Weekly Active Users</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockAdoptionData.weeklyActive}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#718096' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#718096' }} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="users" fill="#0097A9" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Feature usage */}
            <div className="card p-4">
              <p className="section-header mb-4">Feature Usage This Week</p>
              <div className="space-y-3">
                {mockAdoptionData.featureUsage.map(f => {
                  const maxSessions = Math.max(...mockAdoptionData.featureUsage.map(x => (x as any).sessions || (x as any).views || (x as any).recorded || (x as any).completed || (x as any).generated || 0));
                  const value = (f as any).sessions || (f as any).views || (f as any).recorded || (f as any).completed || (f as any).generated || 0;
                  return (
                    <div key={f.feature}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-merz-slate-mid">{f.feature}</span>
                        <span className="text-xs font-semibold text-merz-slate">{value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-merz-teal rounded-full"
                          style={{ width: `${(value / maxSessions) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
