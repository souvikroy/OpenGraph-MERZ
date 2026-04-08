import { useState } from 'react';
import { Search, Filter, Download, Eye, AlertCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { mockChatSessions } from '../data/mockChats';
import type { ComplianceFlag, ProductBrand } from '../types';
import ProductBadge from '../components/shared/ProductBadge';
import ComplianceBadge from '../components/shared/ComplianceBadge';

// Flatten sessions into individual query records
const allQueries = mockChatSessions.flatMap(session =>
  session.messages
    .filter(m => m.role === 'user')
    .map(userMsg => {
      const aiMsg = session.messages.find(
        m => m.role === 'assistant' && m.id > userMsg.id
      );
      return {
        sessionId: session.id,
        repName: session.repName,
        query: userMsg.content,
        response: aiMsg?.content || '',
        timestamp: userMsg.timestamp,
        product: session.product,
        flags: aiMsg?.complianceFlags || [],
        confidence: aiMsg?.confidenceScore,
        citations: aiMsg?.citations || [],
        routingAction: aiMsg?.routingAction,
      };
    })
);

const FLAG_FILTERS: { label: string; value: ComplianceFlag | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Compliant', value: 'compliant' },
  { label: 'Off-Label', value: 'off-label' },
  { label: 'PV Signal', value: 'pv-signal' },
  { label: 'Competitive', value: 'competitive' },
];

export default function AuditTrail() {
  const [search, setSearch] = useState('');
  const [flagFilter, setFlagFilter] = useState<ComplianceFlag | 'all'>('all');
  const [productFilter, setProductFilter] = useState<ProductBrand | 'all'>('all');
  const [selectedQuery, setSelectedQuery] = useState<typeof allQueries[0] | null>(null);

  const filtered = allQueries.filter(q => {
    const matchSearch = !search || q.query.toLowerCase().includes(search.toLowerCase()) || q.repName.toLowerCase().includes(search.toLowerCase());
    const matchFlag = flagFilter === 'all' || q.flags.includes(flagFilter);
    const matchProduct = productFilter === 'all' || q.product === productFilter;
    return matchSearch && matchFlag && matchProduct;
  });

  const stats = {
    total: allQueries.length,
    offLabel: allQueries.filter(q => q.flags.includes('off-label')).length,
    pvSignal: allQueries.filter(q => q.flags.includes('pv-signal')).length,
    competitive: allQueries.filter(q => q.flags.includes('competitive')).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Audit Trail</h1>
          <p className="page-subtitle">Complete log of all Product Expert queries and AI responses</p>
        </div>
        <button className="btn-secondary self-start sm:self-auto shrink-0">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Queries', value: stats.total, icon: <Eye size={16} />, color: 'bg-merz-teal-light text-merz-teal' },
          { label: 'Off-Label Refused', value: stats.offLabel, icon: <AlertCircle size={16} />, color: 'bg-compliance-off-label-bg text-compliance-off-label' },
          { label: 'PV Signals', value: stats.pvSignal, icon: <AlertTriangle size={16} />, color: 'bg-compliance-pv-flag-bg text-compliance-pv-flag' },
          { label: 'Competitive Mentions', value: stats.competitive, icon: <TrendingUp size={16} />, color: 'bg-compliance-low-confidence-bg text-compliance-low-confidence' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-merz-slate-light uppercase tracking-wide">{s.label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>{s.icon}</div>
            </div>
            <p className="text-2xl font-bold text-merz-slate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search queries or reps..."
            className="form-input pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-merz-slate-light" />
          {FLAG_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFlagFilter(f.value)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                flagFilter === f.value
                  ? 'bg-merz-teal text-white'
                  : 'bg-white border border-merz-border text-merz-slate-mid hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(['all', 'Xeomin', 'Belotero', 'Radiesse', 'Ultherapy'] as const).map(p => (
            <button
              key={p}
              onClick={() => setProductFilter(p as ProductBrand | 'all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                productFilter === p
                  ? 'bg-merz-teal text-white'
                  : 'bg-white border border-merz-border text-merz-slate-mid hover:bg-gray-50'
              }`}
            >
              {p === 'all' ? 'All Products' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Table */}
        <div className={`card overflow-hidden ${selectedQuery ? 'md:flex-1' : 'w-full'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-merz-border bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Timestamp</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Rep</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Query</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-merz-slate-light uppercase tracking-wide">Confidence</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-merz-border">
                {filtered.map((q, i) => (
                  <tr
                    key={i}
                    className={`table-row-hover ${selectedQuery === q ? 'bg-merz-teal-light' : ''}`}
                    onClick={() => setSelectedQuery(selectedQuery === q ? null : q)}
                  >
                    <td className="px-4 py-3 text-xs text-merz-slate-light whitespace-nowrap">
                      {format(new Date(q.timestamp), 'MMM d, HH:mm')}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-merz-slate whitespace-nowrap">{q.repName}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-merz-slate line-clamp-1 max-w-xs">{q.query}</p>
                    </td>
                    <td className="px-4 py-3">
                      {q.product && <ProductBadge product={q.product} size="sm" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {q.flags.map(flag => (
                          <ComplianceBadge key={flag} flag={flag} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {q.confidence !== undefined && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                q.confidence >= 90 ? 'bg-compliance-compliant' :
                                q.confidence >= 75 ? 'bg-merz-teal' : 'bg-compliance-pv-flag'
                              }`}
                              style={{ width: `${q.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-merz-slate-mid">{q.confidence}%</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedQuery(selectedQuery === q ? null : q)} className="btn-ghost py-1 px-2 text-xs">
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-merz-slate-light">No queries match the current filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedQuery && (
          <div className="w-full md:w-80 md:shrink-0 card p-4 space-y-4 h-fit">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-merz-slate-light uppercase tracking-wide">Query Detail</p>
              <button onClick={() => setSelectedQuery(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1">Query</p>
              <p className="text-sm text-merz-slate bg-gray-50 p-2 rounded-lg">{selectedQuery.query}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1">Response</p>
              <p className="text-xs text-merz-slate-mid bg-gray-50 p-2 rounded-lg line-clamp-6">{selectedQuery.response}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1">Rep</p>
                <p className="text-xs text-merz-slate">{selectedQuery.repName}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1">Time</p>
                <p className="text-xs text-merz-slate">{format(new Date(selectedQuery.timestamp), 'MMM d, HH:mm')}</p>
              </div>
            </div>
            {selectedQuery.flags.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1">Compliance</p>
                <div className="flex flex-wrap gap-1">
                  {selectedQuery.flags.map(f => <ComplianceBadge key={f} flag={f} />)}
                </div>
              </div>
            )}
            {selectedQuery.citations.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1">Citations</p>
                <div className="space-y-1">
                  {selectedQuery.citations.map((c, i) => (
                    <p key={i} className="text-[11px] text-merz-slate-mid">
                      <span className="font-medium">{c.documentName}</span> · {c.section}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {selectedQuery.routingAction && (
              <div>
                <p className="text-[10px] font-semibold text-merz-slate-light uppercase tracking-wide mb-1">Routing Action</p>
                <p className="text-[11px] text-merz-slate-mid bg-amber-50 p-2 rounded-lg border border-amber-200">{selectedQuery.routingAction}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
