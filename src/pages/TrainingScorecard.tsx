import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { mockTrainingScores } from '../data/mockQuizzes';
import type { ProductBrand } from '../types';
import ProductBadge from '../components/shared/ProductBadge';

const PRODUCT_COLORS: Record<ProductBrand, string> = {
  Xeomin: '#3B82F6',
  Belotero: '#8B5CF6',
  Radiesse: '#F97316',
  Ultherapy: '#0097A9',
};

export default function TrainingScorecard() {
  const navigate = useNavigate();

  // Trend line data for first rep
  const firstRep = mockTrainingScores[0];
  const trendData = firstRep.trend.Xeomin.map((_, i) => ({
    session: `S${i + 1}`,
    Xeomin: firstRep.trend.Xeomin[i],
    Belotero: firstRep.trend.Belotero[i],
    Radiesse: firstRep.trend.Radiesse[i],
    Ultherapy: firstRep.trend.Ultherapy[i],
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/sales-companion/pre-meeting/meetings')} className="btn-ghost shrink-0">
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="page-title flex items-center gap-2">
              <TrendingUp size={20} className="text-merz-teal" />
              Training Scorecards
            </h1>
            <p className="page-subtitle">Per-rep product knowledge scores and trend analysis</p>
          </div>
        </div>
        <button onClick={() => navigate('/sales-companion/pre-meeting/quiz')} className="btn-primary self-start sm:self-auto shrink-0">
          <BookOpen size={14} />
          Start New Quiz
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(['Xeomin', 'Belotero', 'Radiesse', 'Ultherapy'] as ProductBrand[]).map(product => {
          const avg = Math.round(
            mockTrainingScores.reduce((sum, r) => sum + r.scores[product], 0) / mockTrainingScores.length
          );
          return (
            <div key={product} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <ProductBadge product={product} size="sm" showDot={false} />
                {avg >= 80 ? (
                  <CheckCircle size={14} className="text-compliance-compliant" />
                ) : (
                  <AlertCircle size={14} className="text-compliance-pv-flag" />
                )}
              </div>
              <p className={`text-2xl font-bold ${avg >= 80 ? 'text-compliance-compliant' : avg >= 70 ? 'text-merz-teal' : 'text-compliance-off-label'}`}>
                {avg}%
              </p>
              <p className="text-xs text-merz-slate-light">Team average</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rep Scorecards */}
        <div className="card">
          <div className="p-4 border-b border-merz-border flex items-center gap-2">
            <BookOpen size={16} className="text-merz-teal" />
            <span className="section-header">Individual Scores</span>
            <span className="text-xs text-merz-slate-light ml-1">Pass threshold: 70%</span>
          </div>
          <div className="divide-y divide-merz-border">
            {mockTrainingScores.map(rep => (
              <div key={rep.repId} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm text-merz-slate">{rep.repName}</p>
                    <p className="text-xs text-merz-slate-light">Last quiz: {rep.lastQuizDate}</p>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const avg = Math.round(Object.values(rep.scores).reduce((a, b) => a + b, 0) / 4);
                      return (
                        <span className={`text-lg font-bold ${avg >= 80 ? 'text-compliance-compliant' : avg >= 70 ? 'text-merz-teal' : 'text-compliance-off-label'}`}>
                          {avg}%
                        </span>
                      );
                    })()}
                    <p className="text-[10px] text-merz-slate-light">overall</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {(Object.entries(rep.scores) as [ProductBrand, number][]).map(([product, score]) => (
                    <div key={product} className="flex items-center gap-2">
                      <span className="w-20 text-xs text-merz-slate-mid">{product}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${score}%`,
                            backgroundColor: PRODUCT_COLORS[product],
                          }}
                        />
                      </div>
                      <span className={`text-xs font-semibold w-8 text-right ${score >= 80 ? 'text-compliance-compliant' : score >= 70 ? 'text-merz-teal' : 'text-compliance-off-label'}`}>
                        {score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-4">
          {/* Radar */}
          <div className="card p-4">
            <p className="section-header mb-4">Team Knowledge Coverage</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={[
                { subject: 'Xeomin', A: 88, B: 92, C: 65 },
                { subject: 'Belotero', A: 75, B: 88, C: 72 },
                { subject: 'Radiesse', A: 82, B: 79, C: 68 },
                { subject: 'Ultherapy', A: 71, B: 85, C: 60 },
              ]}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#718096' }} />
                <Radar name="James" dataKey="A" stroke="#0097A9" fill="#0097A9" fillOpacity={0.1} />
                <Radar name="Sarah" dataKey="B" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                <Radar name="Omar" dataKey="C" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend lines */}
          <div className="card p-4">
            <p className="section-header mb-1">James Mitchell – Score Trend</p>
            <p className="text-xs text-merz-slate-light mb-4">Last 5 quiz sessions</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="session" tick={{ fontSize: 10, fill: '#718096' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: '#718096' }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                {(['Xeomin', 'Belotero', 'Radiesse', 'Ultherapy'] as ProductBrand[]).map(p => (
                  <Line
                    key={p}
                    type="monotone"
                    dataKey={p}
                    stroke={PRODUCT_COLORS[p]}
                    strokeWidth={2}
                    dot={{ r: 3, fill: PRODUCT_COLORS[p] }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gap analysis */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={16} className="text-compliance-pv-flag" />
          <span className="section-header">Gap Analysis – Areas Needing Focus</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { rep: 'Omar Hassan', product: 'Ultherapy', score: 60, note: 'Below threshold. Recommend 2 additional quiz sessions.' },
            { rep: 'Omar Hassan', product: 'Xeomin', score: 65, note: 'Marginal. Focus on contraindications and dosing precision.' },
            { rep: 'James Mitchell', product: 'Belotero', score: 75, note: 'Approaching threshold. Review CPM technology differentiation.' },
          ].map((gap, i) => (
            <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-merz-slate">{gap.rep}</p>
                <span className="text-sm font-bold text-compliance-off-label">{gap.score}%</span>
              </div>
              <ProductBadge product={gap.product as ProductBrand} size="sm" />
              <p className="text-[11px] text-merz-slate-mid mt-2 leading-relaxed">{gap.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
